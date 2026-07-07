import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'

const TOOLS = [
  { type: 'INSTAGRAM', label: 'Instagram Post', glyph: '◈' },
  { type: 'FACEBOOK', label: 'Facebook Post', glyph: '◆' },
  { type: 'LINKEDIN', label: 'LinkedIn Post', glyph: '▣' },
  { type: 'TWITTER', label: 'X / Twitter Thread', glyph: '✕' },
  { type: 'CAPTION', label: 'Caption Generator', glyph: '❝' },
  { type: 'HASHTAG', label: 'Hashtag Generator', glyph: '#' },
  { type: 'BLOG', label: 'Blog Post', glyph: '▤' },
  { type: 'SEO', label: 'SEO Keywords', glyph: '◎' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/history')
      .then(({ data }) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalGenerated = posts.length
  const favorites = posts.filter((p) => p.favorite).length
  const byTool = TOOLS.map((t) => ({
    ...t,
    count: posts.filter((p) => p.toolType === t.type).length,
  }))
  const mostUsed = [...byTool].sort((a, b) => b.count - a.count)[0]

  return (
    <div>
      <div className="eyebrow">Overview</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '0.3rem 0 0.4rem' }}>
        Welcome back, {user?.fullName?.split(' ')[0]}
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Here's what your agent has shipped so far.
      </p>

      <div style={styles.statGrid}>
        <StatCard label="Total generations" value={loading ? '—' : totalGenerated} />
        <StatCard label="Favorited posts" value={loading ? '—' : favorites} />
        <StatCard label="Most used tool" value={loading ? '—' : (mostUsed?.count ? mostUsed.label : '—')} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2.2rem 0 1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: 0 }}>Quick actions</h2>
        <button className="btn btn-ghost" onClick={() => navigate('/history')}>View history →</button>
      </div>

      <div style={styles.toolGrid}>
        {TOOLS.map((tool) => (
          <button
            key={tool.type}
            className="panel"
            style={styles.toolCard}
            onClick={() => navigate('/generate', { state: { toolType: tool.type } })}
          >
            <span style={styles.toolGlyph}>{tool.glyph}</span>
            <span style={styles.toolLabel}>{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="panel" style={{ padding: '1.4rem 1.5rem' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700 }}>{value}</div>
    </div>
  )
}

const styles = {
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  toolGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
    gap: '0.9rem',
  },
  toolCard: {
    padding: '1.4rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.7rem',
    cursor: 'pointer',
    textAlign: 'left',
    color: 'var(--text-primary)',
  },
  toolGlyph: {
    fontFamily: 'var(--font-mono)',
    fontSize: '1.4rem',
    color: 'var(--signal)',
  },
  toolLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.92rem',
  },
}
