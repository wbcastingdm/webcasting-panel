import { useState, useEffect, useRef } from 'react'
import { media } from '../api'
import { getCurrentSite } from '../components/SiteSelector'

export default function Media() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()
  const siteId = getCurrentSite()

  const load = async () => {
    if (!siteId) return
    setLoading(true)
    try { const res = await media.getAll(siteId); setItems(res.data.items || []) } catch (e) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [siteId])

  const upload = async (e) => {
    const files = Array.from(e.target.files)
    setUploading(true)
    for (const file of files) {
      try { await media.upload(siteId, file) } catch (e) { alert('خطا در آپلود: ' + file.name) }
    }
    setUploading(false)
    load()
  }

  const del = async (id) => {
    if (!confirm('حذف شود؟')) return
    try { await media.delete(siteId, id); load() } catch (e) {}
  }

  const copy = (url) => {
    navigator.clipboard.writeText(url)
    alert('لینک کپی شد')
  }

  return (
    <div>
      <div className="page-header">
        <h1>رسانه</h1>
        <button className="btn btn-primary" onClick={() => fileRef.current.click()} disabled={uploading}>
          {uploading ? 'در حال آپلود...' : '📤 آپلود فایل'}
        </button>
        <input ref={fileRef} type="file" multiple style={{ display: 'none' }} onChange={upload} accept="image/*,video/*,.pdf" />
      </div>

      <div className="card">
        {loading ? <div className="loading">در حال بارگذاری...</div> : items.length === 0 ? <div className="empty">فایلی یافت نشد</div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {items.map(item => (
              <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: '#f8f9fa' }}>
                {item.type === 'image' ? (
                  <img src={item.thumbnailUrl || item.url} alt={item.altText} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                    {item.type === 'video' ? '🎬' : item.type === 'document' ? '📄' : '📁'}
                  </div>
                )}
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.originalName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{Math.round(item.size / 1024)} KB</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                    <button className="btn btn-outline btn-sm" style={{ flex: 1, padding: '4px 6px', fontSize: 11 }} onClick={() => copy(item.url)}>کپی لینک</button>
                    <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} onClick={() => del(item.id)}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
