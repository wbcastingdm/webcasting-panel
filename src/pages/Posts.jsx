import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blog } from '../api'
import { getCurrentSite } from '../components/SiteSelector'

const STATUS_LABEL = { draft: 'پیش‌نویس', published: 'منتشر شده', scheduled: 'زمانبندی', archived: 'آرشیو' }
const STATUS_BADGE = { draft: 'badge-warning', published: 'badge-success', scheduled: 'badge-info', archived: 'badge-danger' }

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const siteId = getCurrentSite()

  const load = async () => {
    if (!siteId) return
    setLoading(true)
    try {
      const res = await blog.getPosts(siteId, { page, search, status, limit: 15 })
      setPosts(res.data.items)
      setTotal(res.data.total)
    } catch (e) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [page, search, status, siteId])
  useEffect(() => { window.addEventListener('siteChanged', load); return () => window.removeEventListener('siteChanged', load) }, [])

  const deletePost = async (id) => {
    if (!confirm('مطلب حذف شود؟')) return
    try {
      await blog.deletePost(siteId, id)
      load()
    } catch (e) { alert('خطا در حذف') }
  }

  return (
    <div>
      <div className="page-header">
        <h1>مطالب وبلاگ ({total})</h1>
        <Link to="/posts/new" className="btn btn-primary">✍️ مطلب جدید</Link>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            className="form-control"
            placeholder="جستجو..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            style={{ flex: 1 }}
          />
          <select
            className="form-control"
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1) }}
            style={{ width: 160 }}
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="published">منتشر شده</option>
            <option value="draft">پیش‌نویس</option>
            <option value="scheduled">زمانبندی</option>
            <option value="archived">آرشیو</option>
          </select>
        </div>
      </div>

      <div className="card">
        {loading ? <div className="loading">در حال بارگذاری...</div> : (
          posts.length === 0 ? <div className="empty">مطلبی یافت نشد</div> : (
            <table className="table">
              <thead>
                <tr>
                  <th>عنوان</th>
                  <th>وضعیت</th>
                  <th>بازدید</th>
                  <th>تاریخ</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{post.title}</div>
                      {post.category && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{post.category.name}</div>}
                    </td>
                    <td><span className={`badge ${STATUS_BADGE[post.status]}`}>{STATUS_LABEL[post.status]}</span></td>
                    <td>{post.viewCount}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {new Date(post.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/posts/${post.id}`} className="btn btn-outline btn-sm">ویرایش</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => deletePost(post.id)}>حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}

        {total > 15 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>قبلی</button>
            <span style={{ padding: '5px 12px', fontSize: 13 }}>صفحه {page}</span>
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p+1)} disabled={page * 15 >= total}>بعدی</button>
          </div>
        )}
      </div>
    </div>
  )
}
