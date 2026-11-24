import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState, type FormEvent } from 'react'
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
          <NavLink to="/modules" onClick={() => setMenuOpen(false)}>AI & IoT</NavLink>
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const demoAccounts: Record<string, { password: string; role: string; name: string; route: string }> = {
    'admin@hydrogrid.local': { password: 'Admin123!', role: 'Admin', name: 'HYDROGRID Admin', route: '/admin' },
    'owner@hydrogrid.local': { password: 'Owner123!', role: 'Tubewell Owner', name: 'Tubewell Owner', route: '/owner' },
    'farmer@hydrogrid.local': { password: 'Farmer123!', role: 'Farmer', name: 'Registered Farmer', route: '/farmer' },
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const account = demoAccounts[email.trim().toLowerCase()]

    if (!account || account.password !== password) {
      setError('Use a demo account shown below.')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      if (response.ok) {
        const result = await response.json()
        localStorage.setItem('hydrogrid-demo-session', JSON.stringify({
          ...result.user,
          token: result.token,
        }))
        navigate(account.route)
        return
      }
    } catch {
      // The static frontend remains usable during backend startup.
    }

    localStorage.setItem('hydrogrid-demo-session', JSON.stringify({
      email: email.trim().toLowerCase(),
      role: account.role,
      name: account.name,
    }))
    navigate(account.route)
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-heading">
        <span className="eyebrow">HYDROGRID account</span>
        <h1 id="login-heading">Sign in</h1>
        <p>Demo mode uses local session storage. Firebase authentication is pending configuration.</p>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button button-primary" type="submit">
            Sign in
          </button>
        </form>
        <div className="demo-accounts" aria-label="Demo account credentials">
          <span>Demo accounts</span>
          <small>Admin: admin@hydrogrid.local / Admin123!</small>
          <small>Owner: owner@hydrogrid.local / Owner123!</small>
          <small>Farmer: farmer@hydrogrid.local / Farmer123!</small>
        </div>
      </section>
    </main>
  )
}

function WorkspacePage({ role }: { role: string }) {
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('hydrogrid-demo-session') || '{}')
    const roleRoute = role === 'Admin' ? 'Admin' : role

    if (!session.token) {
      setLoading(false)
      setDashboard({
        motors: [
          { id: 'motor-001', name: 'Pump A', state: 'ON', flow: 38, voltage: 412 },
          { id: 'motor-002', name: 'Pump B', state: 'OFF', flow: 0, voltage: 418 },
        ],
        requests: [
          { id: 'req-001', farmer: 'Ravi Patel', field: 'North Field', volume: 40, status: 'Approved' },
          { id: 'req-002', farmer: 'Meera Singh', field: 'East Field', volume: 28, status: 'Pending' },
        ],
        activity: [
          { id: 'act-1', message: 'Pump A started', time: '8 minutes ago', type: 'motor' },
          { id: 'act-2', message: 'North reservoir reached 68%', time: '1 hour ago', type: 'sensor' },
        ],
      })
      return
    }

    fetch(`http://127.0.0.1:4000/api/dashboard/${encodeURIComponent(roleRoute)}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Dashboard unavailable')
        setDashboard(await response.json())
      })
      .catch(() => setMessage('Backend data is unavailable. Showing no live mutations.'))
      .finally(() => setLoading(false))
  }, [role])

  async function toggleMotor(motorId: string, nextState: 'ON' | 'OFF') {
    const session = JSON.parse(localStorage.getItem('hydrogrid-demo-session') || '{}')
    if (!session.token) {
      setDashboard((current: any) => ({
        ...current,
        motors: current.motors.map((motor: any) =>
          motor.id === motorId ? { ...motor, state: nextState, flow: nextState === 'ON' ? 38 : 0 } : motor
        ),
      }))
      setMessage(`Demo mode: motor set to ${nextState}`)
      return
    }
    const response = await fetch(`http://127.0.0.1:4000/api/motors/${motorId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state: nextState }),
    })
    if (!response.ok) {
      setMessage('Motor operation was not authorized.')
      return
    }
    const updated = await response.json()
    setDashboard((current: any) => ({
      ...current,
      motors: current.motors.map((item: any) => item.id === updated.id ? updated : item),
    }))
    setMessage(`Motor set to ${nextState}`)
  }

  if (loading) {
    return <main className="dashboard-page"><p>Loading dashboard…</p></main>
  }

  const motorCount = dashboard?.motors?.length || 0
  const activeCount = dashboard?.motors?.filter((motor: any) => motor.state === 'ON').length || 0
  const pendingCount = dashboard?.requests?.filter((request: any) => request.status === 'Pending').length || 0

  return (
    <main className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">{role} workspace</span>
          <h1>Good morning</h1>
        </div>
        <NavLink className="button button-secondary" to="/login" onClick={() => localStorage.removeItem('hydrogrid-demo-session')}>Sign out</NavLink>
      </div>
      {message && <p className="dashboard-message" role="status">{message}</p>}
      <section className="stat-grid" aria-label="Operational summary">
        <article><small>Active motors</small><strong>{activeCount}</strong><span>{motorCount} registered</span></article>
        <article><small>Pending requests</small><strong>{pendingCount}</strong><span>Awaiting review</span></article>
        <article><small>Water delivered</small><strong>184 m³</strong><span>Today</span></article>
        <article><small>Reservoir level</small><strong>68%</strong><span>Healthy</span></article>
      </section>
      <section className="dashboard-grid">
        <article className="dashboard-panel motor-panel">
          <div className="panel-heading"><div><span className="eyebrow">Operations</span><h2>Motor control</h2></div></div>
          <div className="motor-list">
            {dashboard?.motors?.map((motor: any) => (
              <div className="motor-row" key={motor.id}>
                <div>
                  <strong>{motor.name}</strong>
                  <span>{motor.state === 'ON' ? `${motor.flow} m³/h` : 'Idle'} · {motor.voltage || 0} V</span>
                </div>
                <button
                  className={motor.state === 'ON' ? 'motor-toggle is-on' : 'motor-toggle'}
                  type="button"
                  onClick={() => toggleMotor(motor.id, motor.state === 'ON' ? 'OFF' : 'ON')}
                  disabled={role === 'Farmer'}
                  aria-label={`${motor.state === 'ON' ? 'Stop' : 'Start'} ${motor.name}`}
                >
                  <span />
                  {motor.state}
                </button>
              </div>
            ))}
          </div>
        </article>
        <article className="dashboard-panel">
          <div className="panel-heading"><div><span className="eyebrow">Distribution</span><h2>Water requests</h2></div></div>
          <div className="request-list">
            {dashboard?.requests?.map((request: any) => (
              <div className="request-row" key={request.id}>
                <div><strong>{request.farmer}</strong><span>{request.field} · {request.volume} m³</span></div>
                <span className={`request-status status-${request.status.toLowerCase()}`}>{request.status}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="dashboard-panel activity-panel">
          <div className="panel-heading"><div><span className="eyebrow">Live feed</span><h2>Recent activity</h2></div></div>
          <div className="activity-list">
            {dashboard?.activity?.map((item: any) => (
              <div className="activity-row" key={item.id}><span className={`activity-icon ${item.type}`} /><div><strong>{item.message}</strong><small>{item.time}</small></div></div>
            ))}
          </div>
        </article>
      </section>
    </main>
  )
}

function ModulesPage() {
  const [modules, setModules] = useState<any>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('hydrogrid-demo-session') || '{}')
    if (!session.token) {
      setModules({
        smartWater: { reservoirPercent: 68, availableVolume: 1840, efficiencyScore: 87, wastagePercent: 4.2, shortageRisk: 'Low' },
        ai: {
          allocationRecommendations: [
            { farmer: 'Ravi Patel', recommended: 40, urgency: 'High', reason: 'High crop demand and efficient recent usage.' },
            { farmer: 'Meera Singh', recommended: 28, urgency: 'Medium', reason: 'Fits available capacity and approved field limit.' },
            { farmer: 'Arjun Kumar', recommended: 52, urgency: 'Medium', reason: 'Largest field area with below-average recent usage.' },
          ],
          demandPrediction: { value: 218, uncertainty: 18, confidence: 'Demonstration estimate' },
          anomalies: [
            { severity: 'Review', motor: 'Pump C', message: 'Flow reading differs from the simulated operating curve.' },
            { severity: 'Low', motor: 'Pump B', message: 'Unusually long idle interval detected.' },
          ],
        },
        digitalTwin: { status: 'Virtual network only', scenarios: [
          { name: 'Demand increase', impact: '+18% pump load', risk: 'Moderate' },
          { name: 'Water shortage', impact: '-25% available volume', risk: 'High' },
          { name: 'Motor failure', impact: '12% capacity loss', risk: 'High' },
        ] },
        iot: { label: 'SIMULATED READINGS', sensors: [
          { name: 'Reservoir level', value: '68%', state: 'Normal' },
          { name: 'Pump A flow', value: '38 m3/h', state: 'Normal' },
          { name: 'Pump A temperature', value: '54 C', state: 'Watch' },
          { name: 'Water pH', value: '7.2', state: 'Normal' },
        ] },
        maintenance: [
          { motor: 'Pump A', due: '14 days', recommendation: 'Inspect bearing and vibration sensor.', risk: 'Low' },
          { motor: 'Pump B', due: '3 days', recommendation: 'Verify motor temperature.', risk: 'Medium' },
          { motor: 'Pump C', due: 'Overdue', recommendation: 'Investigate connectivity.', risk: 'High' },
        ],
        weather: { label: 'SIMULATED WEATHER', temperature: 28, humidity: 64, rainfall: 3.2, recommendation: 'Reduce non-essential irrigation after forecast rainfall.' },
      })
      return
    }
    fetch('http://127.0.0.1:4000/api/modules', {
      headers: { Authorization: `Bearer ${session.token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Modules unavailable')
        setModules(await response.json())
      })
      .catch(() => {
        setModules({
          smartWater: { reservoirPercent: 68, availableVolume: 1840, efficiencyScore: 87, wastagePercent: 4.2, shortageRisk: 'Low' },
          ai: {
            allocationRecommendations: [
              { farmer: 'Ravi Patel', recommended: 40, urgency: 'High', reason: 'High crop demand and efficient recent usage.' },
              { farmer: 'Meera Singh', recommended: 28, urgency: 'Medium', reason: 'Fits available capacity and approved field limit.' },
            ],
            demandPrediction: { value: 218, uncertainty: 18 },
            anomalies: [{ severity: 'Review', motor: 'Pump C', message: 'Flow reading differs from the simulated operating curve.' }],
          },
          digitalTwin: { status: 'Virtual network only', scenarios: [
            { name: 'Demand increase', impact: '+18% pump load', risk: 'Moderate' },
            { name: 'Water shortage', impact: '-25% available volume', risk: 'High' },
          ] },
          iot: { label: 'SIMULATED READINGS', sensors: [
            { name: 'Reservoir level', value: '68%', state: 'Normal' },
            { name: 'Pump A flow', value: '38 m3/h', state: 'Normal' },
          ] },
          maintenance: [
            { motor: 'Pump A', due: '14 days', recommendation: 'Inspect bearing and vibration sensor.', risk: 'Low' },
          ],
          weather: { label: 'SIMULATED WEATHER', temperature: 28, humidity: 64, rainfall: 3.2, recommendation: 'Reduce non-essential irrigation after forecast rainfall.' },
        })
        setMessage('Backend unavailable. Demo module data is shown.')
      })
  }, [])

  if (!modules) {
    return <main className="dashboard-page"><p>Loading advanced modules…</p></main>
  }

  return (
    <main className="advanced-page">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">HYDROGRID intelligence</span>
          <h1>AI, IoT & Planning</h1>
        </div>
        <span className="demo-badge">Demonstration mode</span>
      </div>
      {message && <p className="dashboard-message" role="status">{message}</p>}

      <section className="stat-grid advanced-stats" aria-label="Advanced system summary">
        <article><small>Reservoir available</small><strong>{modules.smartWater.availableVolume} m³</strong><span>{modules.smartWater.reservoirPercent}% level</span></article>
        <article><small>Distribution efficiency</small><strong>{modules.smartWater.efficiencyScore}%</strong><span>Wastage {modules.smartWater.wastagePercent}%</span></article>
        <article><small>Demand prediction</small><strong>{modules.ai.demandPrediction.value} m³</strong><span>±{modules.ai.demandPrediction.uncertainty} m³</span></article>
        <article><small>Shortage risk</small><strong>{modules.smartWater.shortageRisk}</strong><span>Current simulation</span></article>
      </section>

      <section className="advanced-grid">
        <article className="dashboard-panel ai-panel">
          <div className="panel-heading"><div><span className="eyebrow">AI distribution optimizer</span><h2>Recommended allocations</h2></div></div>
          {modules.ai.allocationRecommendations.map((item: any) => (
            <div className="allocation-row" key={item.farmer}>
              <div><strong>{item.farmer}</strong><span>{item.reason}</span></div>
              <div className="allocation-value"><strong>{item.recommended} m³</strong><small>{item.urgency} urgency</small></div>
            </div>
          ))}
        </article>

        <article className="dashboard-panel twin-panel">
          <div className="panel-heading"><div><span className="eyebrow">Digital twin</span><h2>{modules.digitalTwin.status}</h2></div></div>
          {modules.digitalTwin.scenarios.map((scenario: any) => (
            <div className="scenario-row" key={scenario.name}>
              <strong>{scenario.name}</strong><span>{scenario.impact}</span><small className={`risk-${scenario.risk.toLowerCase()}`}>{scenario.risk} risk</small>
            </div>
          ))}
        </article>

        <article className="dashboard-panel">
          <div className="panel-heading"><div><span className="eyebrow">Advanced IoT</span><h2>{modules.iot.label}</h2></div></div>
          <div className="sensor-grid">
            {modules.iot.sensors.map((sensor: any) => (
              <div className="sensor-card" key={sensor.name}><small>{sensor.name}</small><strong>{sensor.value}</strong><span>{sensor.state}</span></div>
            ))}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="panel-heading"><div><span className="eyebrow">Predictive maintenance</span><h2>Service recommendations</h2></div></div>
          {modules.maintenance.map((item: any) => (
            <div className="maintenance-row" key={item.motor}>
              <div><strong>{item.motor}</strong><span>{item.recommendation}</span></div>
              <small className={`maintenance-risk risk-${item.risk.toLowerCase()}`}>{item.due}</small>
            </div>
          ))}
        </article>

        <article className="dashboard-panel anomaly-panel">
          <div className="panel-heading"><div><span className="eyebrow">Anomaly review</span><h2>Operational flags</h2></div></div>
          {modules.ai.anomalies.map((item: any) => (
            <div className="anomaly-row" key={item.motor}>
              <span className="anomaly-dot" />
              <div><strong>{item.motor} · {item.severity}</strong><small>{item.message}</small></div>
            </div>
          ))}
        </article>

        <article className="dashboard-panel weather-panel">
          <div className="panel-heading"><div><span className="eyebrow">Weather intelligence</span><h2>{modules.weather.label}</h2></div></div>
          <div className="weather-summary">
            <strong>{modules.weather.temperature}°C</strong>
            <div><small>Humidity {modules.weather.humidity}%</small><small>Forecast rain {modules.weather.rainfall} mm</small></div>
          </div>
          <p>{modules.weather.recommendation}</p>
        </article>
      </section>
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
        <Route path="/modules" element={<ModulesPage />} />
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
