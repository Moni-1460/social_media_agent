import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', glyph: '◆' },
  { to: '/generate', label: 'Generate', glyph: '▸' },
  { to: '/history', label: 'History', glyph: '≡' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.logo}>
          <span style={{ color: 'var(--signal)' }}>●</span> AGENT<span style={{ color: 'var(--text-muted)' }}>/OS</span>
        </div>

        <nav style={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              <span style={styles.glyph}>{item.glyph}</span> {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div style={styles.footer}>
        <div style={styles.userBlock}>
          <div style={styles.avatar}>{(user?.fullName || '?').charAt(0).toUpperCase()}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={styles.userName}>{user?.fullName}</div>
            <div style={styles.userEmail}>{user?.email}</div>
          </div>
        </div>
        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={logout}>
          Log out
        </button>
      </div>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: 240,
    minHeight: '100vh',
    background: 'var(--bg-panel)',
    borderRight: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1.5rem 1.1rem',
    position: 'sticky',
    top: 0,
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.05rem',
    letterSpacing: '0.02em',
    marginBottom: '2rem',
    paddingLeft: '0.4rem',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.65rem 0.75rem',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  navLinkActive: {
    background: 'var(--signal-soft)',
    color: 'var(--signal)',
  },
  glyph: {
    fontFamily: 'var(--font-mono)',
    width: 16,
    display: 'inline-block',
    textAlign: 'center',
  },
  footer: {
    borderTop: '1px solid var(--border-subtle)',
    paddingTop: '1rem',
  },
  userBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '0.85rem',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'var(--signal-soft)',
    color: 'var(--signal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    flexShrink: 0,
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}
