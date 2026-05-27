import { useState, useEffect } from 'react'
import { blog, pages, media, contacts } from '../api'
import { getCurrentSite } from '../components/SiteSelector'

export default function Dashboard() {
  const [stats, setStats] = useState({ posts: 0, pages: 0, media: 0, messages: 0 })
  const [loading, setLoading] = useState(true)
  const siteId = getCurrentSite()

  useEffect(() => {
    const load = async () => {
      if (!siteId) return
      try {
        const [postsRes, pagesRes, mediaRes, contactsRes] = await Promise.allSettled([
          blog.getPosts(siteId, { limit: 1 }),
          pages.getAll(siteId),
          media.getAll(siteId),
          contacts.getAll(siteId),
        ])
        setStats({
          posts: postsRes.value?.data?.total || 0,
          pages: pagesRes.value?.data?.length || 0,
          media: mediaRes.value?.data?.total || 0,
          messages: contactsRes.value?.data?.total || 0,
        })
      } catch (e) {}
      setLoading(false)
    }
    load()
    window.addEventListener('siteChanged', load)
    return () => window.removeEventListener('siteChanged', load)
  }, [siteId])

  const cards = [
    { icon: '✍️', label: 'مطالب وبلاگ', value: stats.posts, color: '#1a73e8', link: '/posts' },
    { icon: '📄', label: 'صفحات', value: stats.pages, color: '#34a853', link: '/pages' },
    { icon: '🖼️', label: 'فایل‌های رسانه', value: stats.media, color: '#fbbc04', link: '/media' },
    { icon: '💬', label: 'پیام‌های تماس', value: stats.messages, color: '#ea4335', link: '/contacts' },
  ]

  return (
    <div>
      <div className="page-header">
        <h1>داشبورد</h1>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {loading ? (
        <div className="loading">در حال بارگذاری...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {cards.map(card => (
            <a href={card.link} key={card.label} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-2px)' } }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 52, height: 52,
                    background: card.color + '20',
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24
                  }}>
                    {card.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>{card.value}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{card.label}</div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>دسترسی سریع</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href="/posts/new" className="btn btn-primary btn-sm" style={{ justifyContent: 'flex-start' }}>✍️ مطلب جدید</a>
            <a href="/pages" className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>📄 صفحه جدید</a>
            <a href="/media" className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>🖼️ آپلود فایل</a>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>اطلاعات سیستم</h3>
          <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>وضعیت API</span>
              <span className="badge badge-success">آنلاین ✓</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>نسخه</span>
              <span>1.0.0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>سرور</span>
              <span>185.231.181.131</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
