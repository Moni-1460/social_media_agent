import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import AuthLayout from '../components/AuthLayout.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form.fullName, form.email, form.password)
      toast.success('Account created.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="AGENT / OS"
      title="Create your workspace"
      subtitle="Set up your account to start generating content in minutes."
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.1rem' }}>
          <label className="field-label">Full name</label>
          <input
            className="input-field"
            type="text"
            required
            placeholder="Ada Lovelace"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>
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
            minLength={6}
            placeholder="At least 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading} type="submit">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p style={{ marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--signal)' }}>Sign in</Link>
      </p>
    </AuthLayout>
  )
}
