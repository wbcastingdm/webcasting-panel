// Contacts.jsx
import { useState, useEffect } from 'react'
import { contacts } from '../api'
import { getCurrentSite } from '../components/SiteSelector'

export function Contacts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const siteId = getCurrentSite()

  useEffect(() => {
    if (!siteId) return
    setLoading(true)
    contacts.getAll(siteId).then(res => setItems(res.data.items || [])).finally(() => setLoading(false))
  }, [siteId])

  const sendReply = async () => {
    try {
      await contacts.reply(selected.id, reply)
      setSelected(null); setReply('')
      alert('پاسخ ثبت شد')
    } catch (e) { alert('خطا') }
  }

  const STATUS = { new: 'جدید', seen: 'دیده شده', replied: 'پاسخ داده شده', archived: 'آرشیو' }
  const BADGE = { new: 'badge-danger', seen: 'badge-info', replied: 'badge-success', archived: 'badge-warning' }

  return (
    <div>
      <div className="page-header"><h1>پیام‌های تماس ({items.length})</h1></div>
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>پیام از {selected.name}</h2><button className="modal-close" onClick={() => setSelected(null)}>✕</button></div>
            <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 14 }}>
              <div><strong>ایمیل:</strong> {selected.email}</div>
              {selected.phone && <div><strong>تلفن:</strong> {selected.phone}</div>}
              <div><strong>موضوع:</strong> {selected.subject}</div>
              <div style={{ marginTop: 12, lineHeight: 1.8 }}>{selected.message}</div>
            </div>
            {selected.adminReply && <div style={{ background: '#e6f4ea', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 14 }}><strong>پاسخ قبلی:</strong> {selected.adminReply}</div>}
            <div className="form-group"><label>پاسخ</label><textarea className="form-control" value={reply} onChange={e => setReply(e.target.value)} rows={4} /></div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setSelected(null)}>بستن</button>
              <button className="btn btn-primary" onClick={sendReply}>ارسال پاسخ</button>
            </div>
          </div>
        </div>
      )}
      <div className="card">
        {loading ? <div className="loading">در حال بارگذاری...</div> : items.length === 0 ? <div className="empty">پیامی یافت نشد</div> : (
          <table className="table">
            <thead><tr><th>نام</th><th>موضوع</th><th>وضعیت</th><th>تاریخ</th><th>عملیات</th></tr></thead>
            <tbody>
              {items.map(m => (
                <tr key={m.id}>
                  <td><div style={{ fontWeight: 500 }}>{m.name}</div><div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.email}</div></td>
                  <td>{m.subject}</td>
                  <td><span className={`badge ${BADGE[m.status]}`}>{STATUS[m.status]}</span></td>
                  <td style={{ fontSize: 12 }}>{new Date(m.createdAt).toLocaleDateString('fa-IR')}</td>
                  <td><button className="btn btn-outline btn-sm" onClick={() => { setSelected(m); setReply('') }}>مشاهده</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Contacts
