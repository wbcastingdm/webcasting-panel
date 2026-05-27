import { useState, useEffect } from 'react'
import { users } from '../api'
import { getCurrentSite } from '../components/SiteSelector'

const ROLE_LABEL = { super_admin: 'سوپر ادمین', site_admin: 'ادمین سایت', editor: 'ویرایشگر' }
const ROLE_BADGE = { super_admin: 'badge-danger', site_admin: 'badge-info', editor: 'badge-success' }

export default function Users() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'editor' })
  const siteId = getCurrentSite()

  const load = () => {
    setLoading(true)
    users.getAll(siteId).then(res => setItems(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [siteId])

  const create = async () => {
    try { await users.create({ ...form, siteId }); setShowForm(false); setForm({ email: '', password: '', firstName: '', lastName: '', role: 'editor' }); load() }
    catch (e) { alert(e.response?.data?.message || 'خطا') }
  }

  const remove = async (id) => {
    if (!confirm('این کاربر غیرفعال شود؟')) return
    try { await users.remove(id); load() } catch (e) {}
  }

  return (
    <div>
      <div className="page-header">
        <h1>کاربران</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>👤 کاربر جدید</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>کاربر جدید</h2><button className="modal-close" onClick={() => setShowForm(false)}>✕</button></div>
            {['firstName', 'lastName', 'email', 'password'].map(k => (
              <div className="form-group" key={k}>
                <label>{{ firstName: 'نام', lastName: 'نام خانوادگی', email: 'ایمیل', password: 'رمز عبور' }[k]}</label>
                <input className="form-control" type={k === 'password' ? 'password' : 'text'} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
            <div className="form-group">
              <label>نقش</label>
              <select className="form-control" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="editor">ویرایشگر</option>
                <option value="site_admin">ادمین سایت</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>انصراف</button>
              <button className="btn btn-primary" onClick={create}>ایجاد</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? <div className="loading">در حال بارگذاری...</div> : (
          <table className="table">
            <thead><tr><th>نام</th><th>ایمیل</th><th>نقش</th><th>آخرین ورود</th><th>عملیات</th></tr></thead>
            <tbody>
              {items.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.firstName} {u.lastName}</td>
                  <td style={{ fontSize: 13 }}>{u.email}</td>
                  <td><span className={`badge ${ROLE_BADGE[u.role]}`}>{ROLE_LABEL[u.role]}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('fa-IR') : '—'}</td>
                  <td>
                    {u.role !== 'super_admin' && <button className="btn btn-danger btn-sm" onClick={() => remove(u.id)}>غیرفعال</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
