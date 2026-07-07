import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios.js'

const TOOLS = [
  { type: 'INSTAGRAM', label: 'Instagram Post' },
  { type: 'FACEBOOK', label: 'Facebook Post' },
  { type: 'LINKEDIN', label: 'LinkedIn Post' },
  { type: 'TWITTER', label: 'X / Twitter Thread' },
  { type: 'CAPTION', label: 'Caption Generator' },
  { type: 'HASHTAG', label: 'Hashtag Generator' },
  { type: 'BLOG', label: 'Blog Post' },
  { type: 'SEO', label: 'SEO Keywords' },
]

const TONES = ['Engaging', 'Professional', 'Playful', 'Bold', 'Friendly', 'Persuasive']

export default function Generate() {
  const location = useLocation()
  const [form, setForm] = useState({
    toolType: location.state?.toolType || 'INSTAGRAM',
    topic: '',
    platform: '',
    tone: 'Engaging',
    targetAudience: '',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => setForm({ ...form, [field]: value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.topic.trim()) {
      toast.error('Enter a topic first.')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const { data } = await api.post('/content/generate', form)
      setResult(data)
      toast.success('Content generated.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const copyResult = () => {
    if (!result) return
    navigator.clipboard.writeText(result.generatedContent)
    toast.success('Copied to clipboard.')
  }

  return (
    <div>
      <div className="eyebrow">Generate</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '0.3rem 0 1.6rem' }}>
        AI Content Generator
      </h1>

      <div style={styles.grid}>
        <form className="panel" style={styles.formPanel} onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.1rem' }}>
            <label className="field-label">Tool</label>
            <select
              className="input-field"
              value={form.toolType}
              onChange={(e) => handleChange('toolType', e.target.value)}
            >
              {TOOLS.map((t) => (
                <option key={t.type} value={t.type}>{t.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.1rem' }}>
            <label className="field-label">Topic</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="e.g. Launching our new eco-friendly water bottle"
              value={form.topic}
              onChange={(e) => handleChange('topic', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.1rem' }}>
            <label className="field-label">Platform (optional)</label>
            <input
              className="input-field"
              placeholder="e.g. Instagram"
              value={form.platform}
              onChange={(e) => handleChange('platform', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.1rem' }}>
            <label className="field-label">Tone</label>
            <select
              className="input-field"
              value={form.tone}
              onChange={(e) => handleChange('tone', e.target.value)}
            >
              {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '1.6rem' }}>
            <label className="field-label">Target audience (optional)</label>
            <input
              className="input-field"
              placeholder="e.g. Young professionals aged 25-35"
              value={form.targetAudience}
              onChange={(e) => handleChange('targetAudience', e.target.value)}
            />
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading} type="submit">
            {loading ? 'Generating…' : 'Generate content'}
          </button>
        </form>

        <div className="panel" style={styles.resultPanel}>
          <div style={styles.resultHeader}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              OUTPUT
            </span>
            {result && (
              <button className="btn btn-ghost" onClick={copyResult} type="button">Copy</button>
            )}
          </div>
          <div style={styles.resultBody} className="scrollbar-thin">
            {loading && <PlaceholderState text="Your agent is drafting the content…" />}
            {!loading && !result && (
              <PlaceholderState text="Fill in the form and generate to see AI content here." />
            )}
            {!loading && result && (
              <pre style={styles.resultText}>{result.generatedContent}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlaceholderState({ text }) {
  return (
    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '2rem 0' }}>
      {text}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 380px) 1fr',
    gap: '1.5rem',
    alignItems: 'start',
  },
  formPanel: {
    padding: '1.6rem',
  },
  resultPanel: {
    padding: '1.6rem',
    minHeight: 420,
    display: 'flex',
    flexDirection: 'column',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '0.9rem',
    borderBottom: '1px solid var(--border-subtle)',
  },
  resultBody: {
    flex: 1,
    overflowY: 'auto',
  },
  resultText: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontFamily: 'var(--font-body)',
    fontSize: '0.94rem',
    lineHeight: 1.65,
    margin: 0,
  },
}
