import { NavLink, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import './App.css'

function Brand() {
  return (
    <NavLink className="brand" to="/" aria-label="HYDROGRID home">
      <span className="brand-mark" aria-hidden="true">
        <span />
      </span>
      <span>HYDROGRID</span>
    </NavLink>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
          <span className="sr-only">Toggle navigation</span>
        </button>
        <nav
          id="primary-navigation"
          className={menuOpen ? 'primary-nav is-open' : 'primary-nav'}
          aria-label="Primary navigation"
        >
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Overview</NavLink>
          <NavLink to="/roles" onClick={() => setMenuOpen(false)}>Roles</NavLink>
          <NavLink className="nav-login" to="/login" onClick={() => setMenuOpen(false)}>Sign in</NavLink>
        </nav>
      </div>
    </header>
  )
}

function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Smart irrigation control</span>
          <h1>Water allocation, built for every field.</h1>
          <p>
            HYDROGRID brings tubewell owners, farmers, motors, schedules, and water
            usage into one clear operational workspace.
          </p>
          <div className="hero-actions">
            <NavLink className="button button-primary" to="/roles">Explore roles</NavLink>
            <NavLink className="button button-secondary" to="/login">Sign in</NavLink>
          </div>
        </div>
        <div className="water-visual" aria-label="Water network overview">
          <div className="water-status">
            <span className="status-dot" />
            Network operational
          </div>
          <div className="reservoir">
            <span className="reservoir-wave" />
            <strong>68%</strong>
            <small>Reservoir level</small>
          </div>
          <div className="flow-card flow-card-one">
            <small>Active motors</small>
            <strong>12</strong>
          </div>
          <div className="flow-card flow-card-two">
            <small>Water today</small>
            <strong>184 m³</strong>
          </div>
        </div>
      </section>

      <section className="feature-section" aria-labelledby="platform-heading">
        <div className="section-heading">
          <span className="eyebrow">One connected platform</span>
          <h2 id="platform-heading">Plan, operate, and measure</h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-number">01</span>
            <h3>Coordinate access</h3>
            <p>Manage farmer approvals, tubewell assignments, and role-based access.</p>
          </article>
          <article className="feature-card">
            <span className="feature-number">02</span>
            <h3>Control irrigation</h3>
            <p>Track motors, operating sessions, water delivery, and field schedules.</p>
          </article>
          <article className="feature-card">
            <span className="feature-number">03</span>
            <h3>Measure outcomes</h3>
            <p>Turn operational events into useful usage, performance, and activity reports.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

const roles = [
  {
    title: 'Administrator',
    description: 'Oversee the network, users, approvals, and operational performance.',
    route: '/admin',
  },
  {
    title: 'Tubewell Owner',
    description: 'Manage tubewells, motors, schedules, and assigned farmers.',
    route: '/owner',
  },
  {
    title: 'Farmer',
    description: 'Submit water requests and monitor approved irrigation sessions.',
    route: '/farmer',
  },
]

function RolesPage() {
  return (
    <main className="content-page">
      <div className="section-heading">
        <span className="eyebrow">Role workspaces</span>
        <h1>Designed for every part of the network</h1>
      </div>
      <div className="role-grid">
        {roles.map((role) => (
          <NavLink className="role-card" to={role.route} key={role.title}>
            <h2>{role.title}</h2>
            <p>{role.description}</p>
            <span>View workspace →</span>
          </NavLink>
        ))}
      </div>
    </main>
  )
}

function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-heading">
        <span className="eyebrow">HYDROGRID account</span>
        <h1 id="login-heading">Sign in</h1>
        <p>Authentication will be enabled when Firebase integration is completed.</p>
        <form onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" name="email" placeholder="name@example.com" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" placeholder="Enter password" />
          <button className="button button-primary" type="submit" disabled>
            Authentication unavailable
          </button>
        </form>
      </section>
    </main>
  )
}

function WorkspacePage({ role }: { role: string }) {
  return (
    <main className="content-page">
      <div className="workspace-preview">
        <span className="eyebrow">Foundation preview</span>
        <h1>{role} workspace</h1>
        <p>Dashboard functionality will be implemented in the role-based dashboard phase.</p>
        <NavLink className="button button-secondary" to="/roles">Back to roles</NavLink>
      </div>
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="content-page">
      <div className="workspace-preview">
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <NavLink className="button button-primary" to="/">Return home</NavLink>
      </div>
    </main>
  )
}

function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<WorkspacePage role="Admin" />} />
        <Route path="/owner" element={<WorkspacePage role="Tubewell Owner" />} />
        <Route path="/farmer" element={<WorkspacePage role="Farmer" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
