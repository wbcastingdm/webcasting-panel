import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../api'

export default function Login() {
  const [email, setEmail] = useState('webcastingdm@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await auth.login(email, password)
      localStorage.setItem('token', res.data.accessToken)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ورود')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 20px' }}>
        <div className="card" style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: 64, height: 64,
              background: 'linear-gradient(135deg, #1a73e8, #0f3460)',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '28px'
            }}>🌐</div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: 4 }}>وبکستینگ CMS</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>پنل مدیریت محتوا</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>ایمیل</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@webcasting.ir"
                required
              />
            </div>
            <div className="form-group">
              <label>رمز عبور</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', fontSize: '16px', marginTop: '8px' }}
            >
              {loading ? 'در حال ورود...' : 'ورود به پنل'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
