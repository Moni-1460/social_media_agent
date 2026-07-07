import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div className="eyebrow">404</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: '0.5rem 0 1rem' }}>
        This page doesn't exist
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        The agent couldn't find what you're looking for.
      </p>
      <Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>
    </div>
  )
}
