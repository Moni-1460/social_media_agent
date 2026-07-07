import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios.js'

export default function History() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  const loadPosts = () => {
    setLoading(true)
    api.get('/history')
      .then(({ data }) => setPosts(data))
      .catch(() => toast.error('Could not load history'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadPosts() }, [])

  const toggleFavorite = async (postId) => {
    try {
      const { data } = await api.patch(`/history/${postId}/favorite`)
      setPosts(posts.map((p) => (p.id === postId ? data : p)))
    } catch {
      toast.error('Could not update favorite')
    }
  }

  const deletePost = async (postId) => {
    try {
      await api.delete(`/history/${postId}`)
      setPosts(posts.filter((p) => p.id !== postId))
      toast.success('Post deleted')
    } catch {
      toast.error('Could not delete post')
    }
  }

  const visible = filter === 'ALL' ? posts : posts.filter((p) => p.toolType === filter)
  const toolTypes = ['ALL', ...new Set(posts.map((p) => p.toolType))]

  return (
    <div>
      <div className="eyebrow">Archive</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '0.3rem 0 1.6rem' }}>
        Content History
      </h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {toolTypes.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className="btn"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.8rem',
              background: filter === t ? 'var(--signal-soft)' : 'transparent',
              color: filter === t ? 'var(--signal)' : 'var(--text-secondary)',
              border: '1px solid var(--border-strong)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading…</p>}
      {!loading && visible.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No generated content yet — head to Generate to create your first post.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {visible.map((post) => (
          <div key={post.id} className="panel" style={{ padding: '1.2rem 1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--signal)' }}>
                  {post.toolType}
                </span>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  {post.topic}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn btn-ghost" style={{ padding: '0.4rem 0.7rem' }} onClick={() => toggleFavorite(post.id)}>
                  {post.favorite ? '★ Saved' : '☆ Save'}
                </button>
                <button className="btn btn-ghost" style={{ padding: '0.4rem 0.7rem' }} onClick={() => deletePost(post.id)}>
                  Delete
                </button>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {post.generatedContent.length > 300
                ? post.generatedContent.slice(0, 300) + '…'
                : post.generatedContent}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
