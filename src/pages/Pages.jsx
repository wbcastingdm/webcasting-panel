// Pages.jsx
import { useState, useEffect } from 'react'
import { pages } from '../api'
import { getCurrentSite } from '../components/SiteSelector'

export function Pages() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', content: '', status: 'draft' })
  const siteId = getCurrentSite()

  const load = async () => {
    if (!siteId) return
    setLoading(true)
    try { const res = await pages.getAll(siteId); setItems(res.data) } catch (e) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [siteId])

  const save = async () => {
    try {
      if (editing) { await pages.update(siteId, editing.id, form) }
      else { await pages.create(siteId, form) }
      setShowForm(false); setEditing(null); setForm({ title: '', content: '', status: 'draft' }); load()
    } catch (e) { alert('خطا در ذخیره') }
  }

  const del = async (id) => {
    if (!confirm('حذف شود؟')) return
    try { await pages.delete(siteId, id); load() } catch (e) {}
  }

  const edit = (page) => {
    setEditing(page); setForm({ title: page.title, content: page.content, status: page.status }); setShowForm(true)
  }

  return (
    <div>
      <div className="page-header">
        <h1>صفحات</h1>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', content: '', status: 'draft' }) }}>📄 صفحه جدید</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'ویرایش صفحه' : 'صفحه جدید'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="form-group"><label>عنوان</label><input className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="form-group"><label>محتوا</label><textarea className="form-control" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} style={{ minHeight: 200 }} /></div>
            <div className="form-group"><label>وضعیت</label>
              <select className="form-control" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="draft">پیش‌نویس</option><option value="published">منتشر</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>انصراف</button>
              <button className="btn btn-primary" onClick={save}>ذخیره</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? <div className="loading">در حال بارگذاری...</div> : items.length === 0 ? <div className="empty">صفحه‌ای یافت نشد</div> : (
          <table className="table">
            <thead><tr><th>عنوان</th><th>slug</th><th>وضعیت</th><th>عملیات</th></tr></thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.slug}</td>
                  <td><span className={`badge ${p.status === 'published' ? 'badge-success' : 'badge-warning'}`}>{p.status === 'published' ? 'منتشر' : 'پیش‌نویس'}</span></td>
                  <td><div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => edit(p)}>ویرایش</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(p.id)}>حذف</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Pages
