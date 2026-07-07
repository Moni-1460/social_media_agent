import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import AuthLayout from '../components/AuthLayout.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="AGENT / OS"
      title="Sign in to your workspace"
      subtitle="Generate, manage, and ship social content with your AI agent."
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.1rem' }}>
          <label className="field-label">Email</label>
          <input
            className="input-field"
            type="email"
            required
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div style={{ marginBottom: '1.6rem' }}>
          <label className="field-label">Password</label>
          <input
            className="input-field"
            type="password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading} type="submit">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p style={{ marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        No account yet? <Link to="/register" style={{ color: 'var(--signal)' }}>Create one</Link>
      </p>
    </AuthLayout>
  )
}
