import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { blog } from '../api'
import { getCurrentSite } from '../components/SiteSelector'

export default function PostEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const siteId = getCurrentSite()
  const isEdit = !!id

  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', status: 'draft',
    metaTitle: '', metaDescription: '', allowComments: true
  })
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!siteId) return
    blog.getCategories(siteId).then(res => setCategories(res.data)).catch(() => {})
    if (isEdit) {
      setLoading(true)
      // fetch post by id - using posts list for now
      blog.getPosts(siteId, { limit: 100 }).then(res => {
        const post = res.data.items.find(p => p.id === id)
        if (post) {
          setForm({
            title: post.title || '',
            content: post.content || '',
            excerpt: post.excerpt || '',
            status: post.status || 'draft',
            metaTitle: post.metaTitle || '',
            metaDescription: post.metaDescription || '',
            allowComments: post.allowComments !== false
          })
          setCategoryId(post.categoryId || '')
        }
      }).finally(() => setLoading(false))
    }
  }, [id, siteId])

  const save = async (status) => {
    if (!form.title.trim()) { setError('عنوان الزامی است'); return }
    setSaving(true)
    setError('')
    try {
      const data = { ...form, status: status || form.status, categoryId: categoryId || undefined }
      if (isEdit) {
        await blog.updatePost(siteId, id, data)
      } else {
        await blog.createPost(siteId, data)
      }
      navigate('/posts')
    } catch (e) {
      setError(e.response?.data?.message || 'خطا در ذخیره')
    } finally {
      setSaving(false)
    }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  if (loading) return <div className="loading">در حال بارگذاری...</div>

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'ویرایش مطلب' : 'مطلب جدید'}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={() => navigate('/posts')}>انصراف</button>
          <button className="btn btn-outline" onClick={() => save('draft')} disabled={saving}>ذخیره پیش‌نویس</button>
          <button className="btn btn-primary" onClick={() => save('published')} disabled={saving}>
            {saving ? 'در حال ذخیره...' : '🚀 انتشار'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <label>عنوان مطلب *</label>
              <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="عنوان مطلب را وارد کنید..." style={{ fontSize: 18, fontWeight: 600 }} />
            </div>
            <div className="form-group">
              <label>خلاصه (excerpt)</label>
              <textarea className="form-control" value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="خلاصه‌ای کوتاه از مطلب..." rows={3} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>محتوا *</label>
              <textarea className="form-control" value={form.content} onChange={e => set('content', e.target.value)} placeholder="محتوای مطلب را بنویسید..." style={{ minHeight: 400 }} />
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: 15 }}>تنظیمات SEO</h3>
            <div className="form-group">
              <label>عنوان SEO</label>
              <input className="form-control" value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} placeholder="عنوان برای موتورهای جستجو" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>توضیحات SEO</label>
              <textarea className="form-control" value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} placeholder="توضیح کوتاه برای موتورهای جستجو" rows={3} />
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16, fontSize: 15 }}>وضعیت انتشار</h3>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="draft">پیش‌نویس</option>
                <option value="published">منتشر شده</option>
                <option value="scheduled">زمانبندی</option>
                <option value="archived">آرشیو</option>
              </select>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16, fontSize: 15 }}>دسته‌بندی</h3>
            <select className="form-control" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">بدون دسته‌بندی</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: 15 }}>تنظیمات</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" checked={form.allowComments} onChange={e => set('allowComments', e.target.checked)} />
              اجازه نظرات
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
