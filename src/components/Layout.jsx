import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import SiteSelector from './SiteSelector'

const navItems = [
  { to: '/', icon: '📊', label: 'داشبورد', exact: true },
  { to: '/posts', icon: '✍️', label: 'مطالب وبلاگ' },
  { to: '/pages', icon: '📄', label: 'صفحات' },
  { to: '/media', icon: '🖼️', label: 'رسانه' },
  { to: '/contacts', icon: '💬', label: 'پیام‌ها' },
  { to: '/users', icon: '👥', label: 'کاربران' },
  { to: '/settings', icon: '⚙️', label: 'تنظیمات' },
]

export default function Layout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [collapsed, setCollapsed] = useState(false)

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 240,
        background: 'var(--sidebar-bg)',
        color: 'var(--sidebar-text)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s',
        flexShrink: 0,
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        zIndex: 100,
        overflowX: 'hidden'
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{ fontSize: 28 }}>🌐</span>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>وبکستینگ</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>پنل مدیریت</div>
            </div>
          )}
        </div>

        {/* Site Selector */}
        {!collapsed && <SiteSelector />}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(26,115,232,0.3)' : 'transparent',
                borderRight: isActive ? '3px solid #1a73e8' : '3px solid transparent',
                transition: 'all 0.2s',
                fontSize: 14,
                whiteSpace: 'nowrap'
              })}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          {!collapsed && (
            <div style={{ marginBottom: 12, fontSize: 13, opacity: 0.7 }}>
              {user.email}
            </div>
          )}
          <button
            onClick={logout}
            style={{
              width: '100%', padding: '8px',
              background: 'rgba(234,67,53,0.2)',
              border: '1px solid rgba(234,67,53,0.4)',
              color: '#ff6b6b',
              borderRadius: 8,
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            {collapsed ? '🚪' : '🚪 خروج'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginRight: collapsed ? 64 : 240,
        transition: 'margin 0.3s',
        minHeight: '100vh'
      }}>
        {/* Topbar */}
        <div style={{
          background: 'white',
          padding: '14px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}
          >
            ☰
          </button>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            خوش آمدید، {user.firstName || 'ادمین'} 👋
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
