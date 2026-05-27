import { useState, useEffect } from 'react'
import { sites } from '../api'

const SITE_ICONS = {
  webcasting: '🌐',
  sanjab: '🎨',
  fahim: '🖥️'
}

export default function SiteSelector() {
  const [allSites, setAllSites] = useState([])
  const [current, setCurrent] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    sites.getAll().then(res => {
      const list = res.data
      setAllSites(list)
      const saved = localStorage.getItem('currentSite')
      const found = saved ? list.find(s => s.id === saved) : null
      setCurrent(found || list[0])
      if (!saved && list[0]) localStorage.setItem('currentSite', list[0].id)
    }).catch(() => {})
  }, [])

  const select = (site) => {
    setCurrent(site)
    localStorage.setItem('currentSite', site.id)
    setOpen(false)
    window.dispatchEvent(new Event('siteChanged'))
  }

  if (!current) return null

  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer', padding: '8px 12px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 8
        }}
      >
        <span style={{ fontSize: 20 }}>{SITE_ICONS[current.key] || '🌐'}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{current.name}</div>
          <div style={{ fontSize: 11, opacity: 0.5 }}>{current.domain}</div>
        </div>
        <span style={{ opacity: 0.5, fontSize: 12 }}>▼</span>
      </div>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 16, left: 16,
          background: '#2d2d4e',
          borderRadius: 8,
          overflow: 'hidden',
          zIndex: 200,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          {allSites.map(site => (
            <div
              key={site.id}
              onClick={() => select(site)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                cursor: 'pointer',
                background: current.id === site.id ? 'rgba(26,115,232,0.3)' : 'transparent',
                fontSize: 13
              }}
            >
              <span>{SITE_ICONS[site.key] || '🌐'}</span>
              <div>
                <div style={{ fontWeight: 500 }}>{site.name}</div>
                <div style={{ fontSize: 11, opacity: 0.5 }}>{site.domain}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const getCurrentSite = () => {
  return localStorage.getItem('currentSite')
}
