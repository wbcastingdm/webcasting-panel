import { useState, useEffect } from 'react'
import { sites } from '../api'
import { getCurrentSite } from '../components/SiteSelector'

export default function Settings() {
  const [site, setSite] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const siteId = getCurrentSite()

  useEffect(() => {
    if (!siteId) return
    sites.getAll().then(res => {
      const s = res.data.find(s => s.id === siteId)
      if (s) { setSite(s); setForm(s) }
    }).finally(() => setLoading(false))
  }, [siteId])

  const save = async () => {
    setSaving(true)
    try {
      await sites.update(siteId, form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) { alert('خطا در ذخیره') }
    setSaving(false)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  if (loading) return <div className="loading">در حال بارگذاری...</div>
  if (!site) return <div className="empty">سایتی انتخاب نشده</div>

  const fields = [
    { key: 'name', label: 'نام سایت', type: 'text' },
    { key: 'email', label: 'ایمیل', type: 'email' },
    { key: 'phone', label: 'تلفن', type: 'text' },
    { key: 'address', label: 'آدرس', type: 'text' },
    { key: 'whatsappNumber', label: 'شماره واتساپ', type: 'text' },
    { key: 'description', label: 'توضیحات', type: 'textarea' },
    { key: 'metaTitle', label: 'عنوان SEO', type: 'text' },
    { key: 'metaDescription', label: 'توضیحات SEO', type: 'textarea' },
    { key: 'googleAnalyticsId', label: 'Google Analytics ID', type: 'text' },
    { key: 'instagramUrl', label: 'اینستاگرام', type: 'text' },
    { key: 'linkedinUrl', label: 'لینکدین', type: 'text' },
    { key: 'telegramUrl', label: 'تلگرام', type: 'text' },
  ]

  return (
    <div>
      <div className="page-header">
        <h1>تنظیمات سایت — {site.name}</h1>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? 'در حال ذخیره...' : '💾 ذخیره تغییرات'}
        </button>
      </div>

      {saved && <div className="alert alert-success">تنظیمات با موفقیت ذخیره شد ✓</div>}

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          {fields.map(f => (
            <div className="form-group" key={f.key} style={f.type === 'textarea' ? { gridColumn: '1 / -1' } : {}}>
              <label>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea className="form-control" value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} rows={3} />
              ) : (
                <input className="form-control" type={f.type} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
