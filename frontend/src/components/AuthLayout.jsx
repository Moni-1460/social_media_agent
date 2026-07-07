import React from 'react'

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.brandSide}>
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h1 style={styles.brandTitle}>AI Social Media Agent</h1>
          <p style={styles.brandSubtitle}>
            One agent, every platform. Draft, tune, and ship on-brand posts across
            Instagram, LinkedIn, X, and Facebook — powered by Gemini.
          </p>
        </div>
        <div style={styles.pulseRow}>
          <span style={styles.pulseDot} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            agent status: ready
          </span>
        </div>
      </div>

      <div style={styles.formSide}>
        <div className="panel" style={styles.card}>
          <h2 style={styles.formTitle}>{title}</h2>
          <p style={styles.formSubtitle}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
  },
  brandSide: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '3rem',
    background:
      'linear-gradient(160deg, var(--bg-panel) 0%, var(--bg-base) 100%)',
    borderRight: '1px solid var(--border-subtle)',
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.4rem',
    lineHeight: 1.15,
    margin: '0.6rem 0 1rem',
    maxWidth: 420,
  },
  brandSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
    maxWidth: 380,
    lineHeight: 1.6,
  },
  pulseRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--success)',
    boxShadow: '0 0 0 4px rgba(51, 196, 129, 0.15)',
  },
  formSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: '2.2rem',
  },
  formTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    margin: '0 0 0.4rem',
  },
  formSubtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.88rem',
    marginBottom: '1.8rem',
    lineHeight: 1.5,
  },
}
