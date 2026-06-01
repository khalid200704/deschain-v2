import React, { useState } from 'react'
import { DashboardLayout } from '../components/layouts'
import { useUIStore, useAuthStore } from '../stores'
import { ProtectedRoute } from '../components/common/ProtectedRoute'
import { authAPI } from '../api/endpoints'
import {
  Menu, Mail, Phone, User, Shield, CheckCircle,
  Pencil, X, Save, Lock, Eye, EyeOff, CheckCircle2,
} from 'lucide-react'

const Profile = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user, setUser } = useAuthStore()

  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [pwMode, setPwMode] = useState(false)
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  const handleEditOpen = () => {
    setForm({ first_name: user?.first_name || '', last_name: user?.last_name || '', phone: user?.phone || '' })
    setSaveError('')
    setSaveSuccess(false)
    setEditMode(true)
  }

  const handleSave = async () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setSaveError('Nama depan dan nama belakang wajib diisi')
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      const res = await authAPI.updateProfile(form)
      setUser(res.data)
      setSaveSuccess(true)
      setTimeout(() => { setEditMode(false); setSaveSuccess(false) }, 1200)
    } catch (err) {
      setSaveError(err.response?.data?.detail || 'Gagal menyimpan perubahan')
    } finally {
      setSaving(false)
    }
  }

  const handlePwSave = async () => {
    if (!pwForm.current_password || !pwForm.new_password) {
      setPwError('Semua field wajib diisi')
      return
    }
    if (pwForm.new_password.length < 8) {
      setPwError('Password baru minimal 8 karakter')
      return
    }
    if (pwForm.new_password !== pwForm.confirm) {
      setPwError('Konfirmasi password tidak cocok')
      return
    }
    setPwSaving(true)
    setPwError('')
    try {
      await authAPI.updatePassword({ current_password: pwForm.current_password, new_password: pwForm.new_password })
      setPwSuccess(true)
      setPwForm({ current_password: '', new_password: '', confirm: '' })
      setTimeout(() => { setPwMode(false); setPwSuccess(false) }, 1500)
    } catch (err) {
      setPwError(err.response?.data?.detail || 'Gagal mengganti password')
    } finally {
      setPwSaving(false)
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent'

  return (
    <ProtectedRoute>
      <DashboardLayout sidebarOpen={sidebarOpen} onToggle={toggleSidebar}>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={toggleSidebar} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Menu size={18} className="text-navy-900" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-navy-900">Profil</h1>
            <p className="text-gray-400 text-sm">Kelola informasi akun Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User size={28} className="text-white" />
            </div>
            <h2 className="font-bold text-navy-900 text-lg">
              {user ? `${user.first_name} ${user.last_name}` : '—'}
            </h2>
            <p className="text-gold-500 text-sm font-medium mt-1 capitalize">{user?.user_type}</p>
            {user?.is_verified && (
              <div className="inline-flex items-center gap-1.5 mt-3 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium border border-green-100">
                <CheckCircle size={11} />
                Akun Terverifikasi
              </div>
            )}
          </div>

          {/* Info / Edit card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-navy-900">Informasi Akun</h3>
                {!editMode && (
                  <button
                    onClick={handleEditOpen}
                    className="flex items-center gap-1.5 text-xs font-medium text-gold-600 hover:text-gold-700 bg-gold-50 hover:bg-gold-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Nama Depan</label>
                      <input
                        className={inputClass}
                        value={form.first_name}
                        onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                        placeholder="Nama depan"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Nama Belakang</label>
                      <input
                        className={inputClass}
                        value={form.last_name}
                        onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                        placeholder="Nama belakang"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Nomor Telepon</label>
                    <input
                      className={inputClass}
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="08xxxxxxxxxx"
                      type="tel"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                    <Mail size={12} />
                    Email tidak dapat diubah: <span className="font-medium text-navy-900">{user?.email}</span>
                  </div>

                  {saveError && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{saveError}</p>
                  )}
                  {saveSuccess && (
                    <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                      <CheckCircle2 size={13} /> Perubahan berhasil disimpan
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 bg-navy-900 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-navy-800 disabled:opacity-50 transition-colors"
                    >
                      <Save size={13} />
                      {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      disabled={saving}
                      className="flex items-center gap-1.5 border border-gray-200 text-gray-500 text-xs font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X size={13} />
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {[
                    { icon: User,   label: 'Nama Depan',    value: user?.first_name },
                    { icon: User,   label: 'Nama Belakang', value: user?.last_name },
                    { icon: Mail,   label: 'Email',         value: user?.email },
                    { icon: Phone,  label: 'Telepon',       value: user?.phone || '—' },
                    { icon: Shield, label: 'Tipe Akun',     value: user?.user_type === 'umkm' ? 'UMKM (Pembeli)' : user?.user_type === 'vendor' ? 'Vendor (Supplier)' : user?.user_type },
                  ].map((row) => {
                    const Icon = row.icon
                    return (
                      <div key={row.label} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2 w-36 flex-shrink-0">
                          <Icon size={13} className="text-gray-400" />
                          <span className="text-xs text-gray-400">{row.label}</span>
                        </div>
                        <span className="text-sm font-medium text-navy-900">{row.value || '—'}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Ganti password card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lock size={15} className="text-navy-900" />
                  <h3 className="text-sm font-semibold text-navy-900">Keamanan</h3>
                </div>
                {!pwMode && (
                  <button
                    onClick={() => { setPwMode(true); setPwError(''); setPwSuccess(false) }}
                    className="text-xs font-medium text-gold-600 hover:text-gold-700 bg-gold-50 hover:bg-gold-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Ganti Password
                  </button>
                )}
              </div>

              {pwMode ? (
                <div className="space-y-3">
                  {[
                    { key: 'current_password', label: 'Password Lama' },
                    { key: 'new_password', label: 'Password Baru' },
                    { key: 'confirm', label: 'Konfirmasi Password Baru' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                      <div className="relative">
                        <input
                          type={showPw[key] ? 'text' : 'password'}
                          className={inputClass + ' pr-9'}
                          value={pwForm[key]}
                          onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPw(s => ({ ...s, [key]: !s[key] }))}
                        >
                          {showPw[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {pwError && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{pwError}</p>
                  )}
                  {pwSuccess && (
                    <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                      <CheckCircle2 size={13} /> Password berhasil diperbarui
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handlePwSave}
                      disabled={pwSaving}
                      className="flex items-center gap-1.5 bg-navy-900 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-navy-800 disabled:opacity-50 transition-colors"
                    >
                      <Save size={13} />
                      {pwSaving ? 'Menyimpan...' : 'Simpan Password'}
                    </button>
                    <button
                      onClick={() => setPwMode(false)}
                      disabled={pwSaving}
                      className="flex items-center gap-1.5 border border-gray-200 text-gray-500 text-xs font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X size={13} />
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Ganti password akun Anda secara berkala untuk keamanan.</p>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default Profile
