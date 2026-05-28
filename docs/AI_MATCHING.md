# Deschain AI Matching Algorithm

## Overview

The AI matching service is responsible for:
1. Identifying similar procurement requests from different UMKMs
2. Forming optimal groups for collective purchasing
3. Recommending the best suppliers for each group
4. Calculating potential savings and discount rates

## Algorithm Layers

### Layer 1: Request Similarity Matching

#### 1.1 Product Similarity (TF-IDF + Semantic)

**Input**:
- Product name
- Product description
- Product category
- Quality specifications

**Process**:
```python
def calculate_product_similarity(request1, request2):
    # Combine product fields
    text1 = f"{request1.product_name} {request1.product_description} {request1.product_category}"
    text2 = f"{request2.product_name} {request2.product_description} {request2.product_category}"
    
    # TF-IDF vectorization
    tfidf_similarity = cosine_similarity(vectorize_tfidf(text1), vectorize_tfidf(text2))
    
    # Category exact match bonus
    category_match_bonus = 0.15 if request1.category == request2.category else 0
    
    # Final similarity score
    return min(1.0, tfidf_similarity + category_match_bonus)
```

**Output**:
- Similarity score (0-1): How similar are the products?

#### 1.2 Temporal Alignment

**Input**:
- Preferred delivery dates
- Delivery urgency

**Process**:
```python
def calculate_temporal_alignment(request1, request2):
    date_diff_days = abs((request1.delivery_date - request2.delivery_date).days)
    
    # Requests within 7 days are good
    if date_diff_days <= 7:
        temporal_score = 1.0
    elif date_diff_days <= 14:
        temporal_score = 0.8
    elif date_diff_days <= 30:
        temporal_score = 0.5
    else:
        temporal_score = 0.2
    
    # Adjust based on urgency
    urgency_weight = get_urgency_weight(request1.urgency, request2.urgency)
    
    return temporal_score * urgency_weight
```

**Output**:
- Temporal alignment score (0-1)

#### 1.3 Geographic Compatibility

**Input**:
- Delivery city/location
- Delivery address

**Process**:
```python
def calculate_geographic_compatibility(request1, request2):
    # Same city = high compatibility
    if request1.delivery_city == request2.delivery_city:
        return 1.0
    
    # Same region/province
    elif request1.province == request2.province:
        return 0.7
    
    # Calculate distance
    distance_km = calculate_distance(
        (request1.latitude, request1.longitude),
        (request2.latitude, request2.longitude)
    )
    
    # Distance penalty
    distance_score = max(0, 1 - (distance_km / 100))
    return distance_score
```

**Output**:
- Geographic compatibility score (0-1)

#### 1.4 Volume Aggregation Potential

**Input**:
- Quantity and unit
- Budget

**Process**:
```python
def calculate_volume_potential(request1, request2):
    # Normalize quantities to same unit
    qty1_normalized = normalize_quantity(request1.quantity, request1.unit)
    qty2_normalized = normalize_quantity(request2.quantity, request2.unit)
    
    total_volume = qty1_normalized + qty2_normalized
    
    # Higher volume = higher potential savings
    if total_volume >= 1000:
        volume_score = 1.0  # Bulk order threshold
    elif total_volume >= 500:
        volume_score = 0.8
    elif total_volume >= 100:
        volume_score = 0.6
    else:
        volume_score = 0.4
    
    return volume_score
```

**Output**:
- Volume potential score (0-1)

#### 1.5 Combined Request Similarity

**Process**:
```python
def calculate_request_similarity(request1, request2):
    weights = {
        'product': 0.40,
        'temporal': 0.25,
        'geographic': 0.20,
        'volume': 0.15
    }
    
    similarity = (
        calculate_product_similarity(request1, request2) * weights['product'] +
        calculate_temporal_alignment(request1, request2) * weights['temporal'] +
        calculate_geographic_compatibility(request1, request2) * weights['geographic'] +
        calculate_volume_potential(request1, request2) * weights['volume']
    )
    
    return similarity
```

**Output**:
- Final similarity score (0-1)
- Threshold: > 0.65 = match

### Layer 2: Group Formation

#### 2.1 Optimal Group Size

```python
def determine_optimal_group_size(matched_requests):
    """
    Find the optimal group size for maximum savings
    """
    n = len(matched_requests)
    
    # Diminishing returns after 10 members
    if n > 10:
        # Break into multiple groups
        return split_into_subgroups(matched_requests, max_size=8)
    
    return matched_requests
```

#### 2.2 Volume-Based Discount Estimation

```python
def estimate_discount_percentage(total_volume):
    """
    Estimate savings based on volume (typically 5-20% for UMKM)
    """
    if total_volume >= 5000:
        return 0.18  # 18% discount
    elif total_volume >= 2000:
        return 0.15  # 15% discount
    elif total_volume >= 1000:
        return 0.12  # 12% discount
    elif total_volume >= 500:
        return 0.08  # 8% discount
    elif total_volume >= 200:
        return 0.05  # 5% discount
    else:
        return 0.02  # 2% discount
```

#### 2.3 Group Formation Score

```python
def calculate_group_formation_score(group):
    """
    Score how well requests form a cohesive group
    """
    scores = []
    
    # Pairwise similarity
    for i, req1 in enumerate(group):
        for req2 in group[i+1:]:
            scores.append(calculate_request_similarity(req1, req2))
    
    # Average pair similarity
    avg_similarity = sum(scores) / len(scores)
    
    # Diversity penalty (avoid identical requests)
    diversity = 1 - (max(scores) - min(scores)) / (max(scores) + 0.001)
    
    # Size benefit (more is better, but with diminishing returns)
    size_factor = min(1.0, len(group) / 10)
    
    return (avg_similarity * 0.6) + (diversity * 0.2) + (size_factor * 0.2)
```

### Layer 3: Supplier Recommendation

#### 3.1 Supplier Scoring

```python
def calculate_supplier_score(supplier, group):
    """
    Score how well a supplier matches the group's needs
    """
    factors = {
        'price_competitiveness': 0.35,
        'delivery_reliability': 0.25,
        'quality_rating': 0.20,
        'product_match': 0.12,
        'geographic_proximity': 0.08
    }
    
    score = (
        calculate_price_competitiveness(supplier) * factors['price_competitiveness'] +
        calculate_delivery_reliability(supplier) * factors['delivery_reliability'] +
        calculate_quality_rating(supplier) * factors['quality_rating'] +
        calculate_product_match(supplier, group) * factors['product_match'] +
        calculate_geographic_proximity(supplier, group) * factors['geographic_proximity']
    )
    
    return score
```

#### 3.2 Price Competitiveness

```python
def calculate_price_competitiveness(supplier):
    """
    Compare supplier's price against market average
    """
    supplier_avg_price = supplier.historical_avg_price
    market_avg_price = get_market_average_price(supplier.category)
    
    if supplier_avg_price <= market_avg_price * 0.95:
        return 1.0  # 5%+ below market
    elif supplier_avg_price <= market_avg_price:
        return 0.8  # At or slightly below market
    elif supplier_avg_price <= market_avg_price * 1.1:
        return 0.6  # Up to 10% above market
    else:
        return 0.3  # Significantly above market
```

#### 3.3 Delivery Reliability

```python
def calculate_delivery_reliability(supplier):
    """
    Score based on on-time delivery rate
    """
    on_time_rate = supplier.on_time_delivery_rate
    
    if on_time_rate >= 0.95:
        return 1.0
    elif on_time_rate >= 0.85:
        return 0.9
    elif on_time_rate >= 0.75:
        return 0.7
    elif on_time_rate >= 0.60:
        return 0.5
    else:
        return 0.3
```

## Matching Pipeline

```python
async def match_procurement_requests():
    """
    Main AI matching pipeline (run daily or on demand)
    """
    
    # 1. Get all active, unmatched requests
    active_requests = await get_active_unmatched_requests()
    
    # 2. Calculate pairwise similarities
    similarity_matrix = []
    for i, req1 in enumerate(active_requests):
        for j, req2 in enumerate(active_requests):
            if i < j:  # Avoid duplicates
                sim = calculate_request_similarity(req1, req2)
                if sim > 0.65:  # Threshold
                    similarity_matrix.append({
                        'req1_id': req1.id,
                        'req2_id': req2.id,
                        'similarity': sim
                    })
    
    # 3. Form groups using clustering
    groups = form_groups_from_similarity_matrix(similarity_matrix)
    
    # 4. For each group, recommend suppliers
    for group in groups:
        recommended_suppliers = []
        for supplier in get_relevant_suppliers(group):
            score = calculate_supplier_score(supplier, group)
            recommended_suppliers.append({
                'supplier_id': supplier.id,
                'score': score,
                'estimated_discount': estimate_discount_percentage(group.total_volume),
                'estimated_savings': estimate_savings(group, supplier)
            })
        
        # 5. Save match results
        await save_match_results(
            requests=group.request_ids,
            suppliers=recommended_suppliers,
            group_score=calculate_group_formation_score(group)
        )
    
    return groups
```

## Embedding-Based Approach (Future Enhancement)

```python
# For future: Using sentence-transformers or similar
def generate_product_embedding(request):
    """
    Generate semantic embedding for product (using pre-trained model)
    """
    text = f"{request.product_name}. {request.product_description}"
    embedding = sentence_transformer.encode(text)
    return embedding

# Store in PostgreSQL with pgvector extension
# Then use vector similarity for matching
```

## Performance Metrics

```python
def evaluate_matching_quality():
    """
    Measure matching algorithm performance
    """
    metrics = {
        'false_positive_rate': 0.05,  # Max 5%
        'false_negative_rate': 0.10,  # Max 10%
        'average_group_size': 4.5,
        'average_savings_percentage': 10.2,
        'user_satisfaction': 4.2/5.0,
        'processing_time_ms': 250
    }
    return metrics
```

## Data Flow Diagram

```
Raw Procurement Requests
        ↓
[Similarity Calculation]
        ↓
Similarity Matrix
        ↓
[Clustering/Group Formation]
        ↓
Potential Groups
        ↓
[Volume-Based Scoring]
        ↓
Ranked Groups
        ↓
[Supplier Matching]
        ↓
Recommendations + Savings Estimates
        ↓
Store Results & Notify Users
```

## Configuration

```python
# algorithms/config.py
MATCHING_CONFIG = {
    'similarity_threshold': 0.65,
    'max_group_size': 10,
    'min_group_size': 2,
    'processing_schedule': 'daily',  # Run daily at 2 AM
    'temporal_window_days': 30,
    'distance_radius_km': 200,
    
    'weights': {
        'product_similarity': 0.40,
        'temporal_alignment': 0.25,
        'geographic_compatibility': 0.20,
        'volume_potential': 0.15
    },
    
    'discount_brackets': {
        5000: 0.18,
        2000: 0.15,
        1000: 0.12,
        500: 0.08,
        200: 0.05,
        0: 0.02
    }
}
```

## Testing & Validation

```python
def test_matching_algorithm():
    """
    Test suite for matching algorithm
    """
    test_cases = [
        {
            'name': 'identical_products_same_location',
            'requests': [request_rice_100kg_jakarta, request_rice_150kg_jakarta],
            'expected_similarity': 0.9,
            'expected_group_size': 2
        },
        {
            'name': 'different_products_different_locations',
            'requests': [request_rice_bandung, request_cement_medan],
            'expected_similarity': 0.2,
            'expected_group_size': 0
        }
    ]
    
    for test in test_cases:
        run_test(test)
```

---

**Version**: 1.0
**Algorithm Status**: MVP (TF-IDF based)
**Future**: Transformer-based embeddings, real-time online learning
