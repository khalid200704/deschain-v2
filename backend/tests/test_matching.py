"""
Unit tests untuk algoritma inti Deschain.
Mencakup: _jaccard, _savings_rate, _dp_optimal_group (matching)
dan _sma, _eoq, _calc_credit_score (analytics).
"""
import pytest
from types import SimpleNamespace

from app.domains.matching.router import _jaccard, _savings_rate, _dp_optimal_group
from app.domains.analytics.router import _sma, _eoq, _calc_credit_score


# ── Helpers ──────────────────────────────────────────────────────────────────

def _req(budget: float, category: str = "Sembako", city: str = "Pontianak"):
    """Buat mock ProcurementRequest dengan atribut minimal."""
    return SimpleNamespace(budget=budget, product_category=category, delivery_city=city)


# ── _jaccard ─────────────────────────────────────────────────────────────────

class TestJaccard:
    def test_identical_strings(self):
        assert _jaccard("sembako beras", "sembako beras") == 1.0

    def test_completely_different(self):
        assert _jaccard("beras padi", "semen baja") == 0.0

    def test_partial_overlap(self):
        score = _jaccard("beras minyak gula", "beras gula tepung")
        assert 0.0 < score < 1.0

    def test_empty_strings(self):
        # Kedua set kosong → intersection 0, union 0 → hasilnya 0
        assert _jaccard("", "") == 0.0

    def test_one_empty(self):
        assert _jaccard("beras", "") == 0.0

    def test_single_word_match(self):
        assert _jaccard("beras", "beras") == 1.0

    def test_case_insensitive(self):
        assert _jaccard("Beras", "beras") == 1.0

    def test_subset(self):
        # "beras" ⊂ "beras minyak" → Jaccard = 1/2
        assert _jaccard("beras", "beras minyak") == pytest.approx(0.5)


# ── _savings_rate ─────────────────────────────────────────────────────────────

class TestSavingsRate:
    def test_one_member_returns_base(self):
        assert _savings_rate(1) == pytest.approx(0.08)

    def test_two_members_base(self):
        assert _savings_rate(2) == pytest.approx(0.08)

    def test_three_members_tier_2(self):
        assert _savings_rate(3) == pytest.approx(0.15)

    def test_four_members_tier_2(self):
        assert _savings_rate(4) == pytest.approx(0.15)

    def test_five_members_tier_3(self):
        assert _savings_rate(5) == pytest.approx(0.20)

    def test_nine_members_tier_3(self):
        assert _savings_rate(9) == pytest.approx(0.20)

    def test_ten_members_max_tier(self):
        assert _savings_rate(10) == pytest.approx(0.25)

    def test_above_ten_still_max(self):
        assert _savings_rate(20) == pytest.approx(0.25)

    def test_rate_monotonically_nondecreasing(self):
        rates = [_savings_rate(n) for n in range(1, 15)]
        for i in range(len(rates) - 1):
            assert rates[i] <= rates[i + 1]


# ── _dp_optimal_group ─────────────────────────────────────────────────────────

class TestDPOptimalGroup:
    def test_empty_candidates_returns_none(self):
        assert _dp_optimal_group([], user_budget=500_000) is None

    def test_single_candidate_returns_group(self):
        candidates = [(0.9, _req(500_000))]
        result = _dp_optimal_group(candidates, user_budget=500_000)
        assert result is not None
        assert result["k"] == 1
        assert result["savings"] > 0

    def test_multiple_candidates_selects_best(self):
        # Budget besar → lebih berharga untuk dipilih DP
        candidates = [
            (0.9, _req(2_000_000)),  # nilai tinggi
            (0.5, _req(100_000)),    # nilai rendah
            (0.8, _req(1_500_000)),  # nilai sedang-tinggi
        ]
        result = _dp_optimal_group(candidates, user_budget=1_000_000)
        assert result is not None
        assert result["k"] >= 1
        # Savings harus positif
        assert result["savings"] > 0

    def test_max_size_respected(self):
        candidates = [(0.8, _req(500_000)) for _ in range(20)]
        result = _dp_optimal_group(candidates, user_budget=500_000, max_size=5)
        assert result is not None
        assert result["k"] <= 5

    def test_savings_uses_correct_rate(self):
        # 9 kandidat dipilih semua → 10 anggota total → rate 25%
        candidates = [(1.0, _req(1_000_000)) for _ in range(9)]
        result = _dp_optimal_group(candidates, user_budget=1_000_000, max_size=9)
        assert result is not None
        assert result["rate"] == pytest.approx(0.25)

    def test_members_list_populated(self):
        candidates = [(0.9, _req(800_000)), (0.7, _req(600_000))]
        result = _dp_optimal_group(candidates, user_budget=1_000_000)
        assert result is not None
        assert len(result["members"]) == result["k"]

    def test_high_similarity_preferred(self):
        # Kandidat dengan similarity tinggi dan budget sama — keduanya dipilih
        candidates = [
            (1.0, _req(1_000_000)),
            (1.0, _req(1_000_000)),
        ]
        result = _dp_optimal_group(candidates, user_budget=1_000_000)
        assert result is not None
        assert result["k"] == 2  # Dua anggota → savings lebih besar


# ── _sma (Simple Moving Average) ─────────────────────────────────────────────

class TestSMA:
    def test_empty_series(self):
        assert _sma([], window=7) == []

    def test_single_element(self):
        assert _sma([100.0], window=7) == [100.0]

    def test_window_larger_than_series(self):
        series = [10.0, 20.0, 30.0]
        result = _sma(series, window=7)
        assert len(result) == 3
        # Elemen terakhir: rata-rata semua = 20.0
        assert result[-1] == pytest.approx(20.0)

    def test_window_1_returns_same(self):
        series = [5.0, 10.0, 15.0]
        assert _sma(series, window=1) == pytest.approx(series)

    def test_output_length_equals_input(self):
        series = list(range(10))
        result = _sma(series, window=3)
        assert len(result) == len(series)

    def test_smoothing_reduces_variance(self):
        # Rangkaian noisy: SMA harus lebih halus
        series = [100.0, 1.0, 100.0, 1.0, 100.0]
        smoothed = _sma(series, window=3)
        raw_var = max(series) - min(series)
        smooth_var = max(smoothed) - min(smoothed)
        assert smooth_var < raw_var


# ── _eoq (Economic Order Quantity) ───────────────────────────────────────────

class TestEOQ:
    def test_zero_demand_returns_zero(self):
        assert _eoq(annual_demand=0) == 0

    def test_positive_demand_positive_result(self):
        qty = _eoq(annual_demand=1000, ordering_cost=50_000, avg_unit_price=10_000)
        assert qty > 0

    def test_higher_demand_larger_order(self):
        low  = _eoq(annual_demand=100,  ordering_cost=50_000, avg_unit_price=10_000)
        high = _eoq(annual_demand=1000, ordering_cost=50_000, avg_unit_price=10_000)
        assert high > low

    def test_higher_price_smaller_order(self):
        cheap     = _eoq(annual_demand=500, ordering_cost=50_000, avg_unit_price=1_000)
        expensive = _eoq(annual_demand=500, ordering_cost=50_000, avg_unit_price=50_000)
        assert cheap > expensive

    def test_formula_approx(self):
        # EOQ = sqrt(2DS/H), H = 0.20 × unit_price
        import math
        D, S, price = 1000, 50_000, 10_000
        H = 0.20 * price
        expected = int(math.sqrt(2 * D * S / H))
        result = _eoq(annual_demand=D, ordering_cost=S, avg_unit_price=price)
        assert result == expected

    def test_minimum_one_unit(self):
        # Demand sangat kecil → hasil minimal 1
        assert _eoq(annual_demand=0.001, ordering_cost=1, avg_unit_price=1_000) >= 1


# ── _calc_credit_score ────────────────────────────────────────────────────────

class TestCalcCreditScore:
    def test_base_score_no_transactions(self):
        score = _calc_credit_score(completed=0, avg_savings_pct=0.0, total_value=0.0)
        assert score == pytest.approx(3.0)

    def test_one_completed_adds_points(self):
        score = _calc_credit_score(completed=1, avg_savings_pct=0.0, total_value=0.0)
        assert score > 3.0

    def test_score_increases_with_completions(self):
        s1 = _calc_credit_score(completed=1, avg_savings_pct=0.0, total_value=0.0)
        s3 = _calc_credit_score(completed=3, avg_savings_pct=0.0, total_value=0.0)
        s7 = _calc_credit_score(completed=7, avg_savings_pct=0.0, total_value=0.0)
        assert s1 < s3 < s7

    def test_savings_threshold_15pct(self):
        base  = _calc_credit_score(completed=0, avg_savings_pct=14.9, total_value=0.0)
        above = _calc_credit_score(completed=0, avg_savings_pct=15.0, total_value=0.0)
        assert above > base

    def test_savings_threshold_20pct(self):
        at15 = _calc_credit_score(completed=0, avg_savings_pct=15.0, total_value=0.0)
        at20 = _calc_credit_score(completed=0, avg_savings_pct=20.0, total_value=0.0)
        assert at20 > at15

    def test_value_threshold_10m(self):
        below = _calc_credit_score(completed=0, avg_savings_pct=0.0, total_value=9_999_999)
        above = _calc_credit_score(completed=0, avg_savings_pct=0.0, total_value=10_000_000)
        assert above > below

    def test_max_reachable_score(self):
        # Semua threshold terpenuhi: 3.0 + 0.3 + 0.2 + 0.3 + 0.2 + 0.2 + 0.1 + 0.2 = 4.5
        score = _calc_credit_score(completed=100, avg_savings_pct=99.0, total_value=999_999_999)
        assert score == pytest.approx(4.5)
        assert score <= 5.0  # cap tidak dilanggar

    def test_min_score_floored_at_1(self):
        score = _calc_credit_score(completed=0, avg_savings_pct=0.0, total_value=0.0)
        assert score >= 1.0

    def test_score_is_rounded_to_1_decimal(self):
        score = _calc_credit_score(completed=3, avg_savings_pct=17.0, total_value=15_000_000)
        assert score == round(score, 1)
