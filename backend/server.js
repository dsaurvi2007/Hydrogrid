import express from 'express'
import cors from 'cors'
import { readFile, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))
const dataPath = join(root, 'data.json')
const app = express()
const port = Number(process.env.PORT || 4000)

app.use(cors({ origin: process.env.FRONTEND_URL || true }))
app.use(express.json())

const accounts = {
  'admin@hydrogrid.local': { password: 'Admin123!', role: 'Admin', name: 'HYDROGRID Admin' },
  'owner@hydrogrid.local': { password: 'Owner123!', role: 'Tubewell Owner', name: 'Tubewell Owner' },
  'farmer@hydrogrid.local': { password: 'Farmer123!', role: 'Farmer', name: 'Registered Farmer' },
}
const sessions = new Map()

async function loadData() {
  return JSON.parse(await readFile(dataPath, 'utf8'))
}

async function saveData(data) {
  await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`)
}

function authorize(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer /, '')
  const session = token ? sessions.get(token) : null
  if (!session) return res.status(401).json({ error: 'Authentication required' })
  req.session = session
  next()
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'HYDROGRID backend', mode: 'local-demo' })
})

app.post('/api/auth/login', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  const account = accounts[email]
  if (!account || account.password !== password) {
    return res.status(401).json({ error: 'Invalid demo credentials' })
  }
  const token = randomUUID()
  const session = { email, role: account.role, name: account.name }
  sessions.set(token, session)
  res.json({ token, user: session })
})

app.post('/api/auth/logout', authorize, (req, res) => {
  const token = req.headers.authorization.replace(/^Bearer /, '')
  sessions.delete(token)
  res.status(204).end()
})

app.get('/api/dashboard/:role', authorize, async (req, res) => {
  const data = await loadData()
  res.json({
    role: req.params.role,
    user: req.session,
    farmers: data.farmers,
    tubewells: data.tubewells,
    motors: data.motors,
    requests: data.requests,
    activity: data.activity,
  })
})

app.get('/api/modules', authorize, async (_req, res) => {
  const data = await loadData()
  res.json({
    mode: 'SIMULATION',
    smartWater: {
      reservoirPercent: 68,
      availableVolume: 1840,
      efficiencyScore: 87,
      wastagePercent: 4.2,
      shortageRisk: 'Low',
      forecasts: [
        { period: 'Today', demand: 184, supply: 220 },
        { period: 'Tomorrow', demand: 218, supply: 205 },
        { period: '7 days', demand: 1460, supply: 1512 },
      ],
    },
    ai: {
      allocationRecommendations: [
        { farmer: 'Ravi Patel', hectares: 12, recommended: 40, urgency: 'High', reason: 'Crop demand is high and existing allocation has been used efficiently.' },
        { farmer: 'Meera Singh', hectares: 8, recommended: 28, urgency: 'Medium', reason: 'Pending request fits available capacity without exceeding the field limit.' },
        { farmer: 'Arjun Kumar', hectares: 15, recommended: 52, urgency: 'Medium', reason: 'Largest field area, but recent usage is below the network average.' },
      ],
      demandPrediction: { value: 218, uncertainty: 18, unit: 'm3', confidence: 'Demonstration estimate' },
      anomalies: [
        { id: 'anom-1', severity: 'Review', motor: 'Pump C', message: 'Flow sensor reading differs from the simulated operating curve.' },
        { id: 'anom-2', severity: 'Low', motor: 'Pump B', message: 'Longer than usual idle interval detected.' },
      ],
    },
    digitalTwin: {
      status: 'Virtual network only',
      tubewells: data.tubewells,
      motors: data.motors,
      scenarios: [
        { name: 'Demand increase', impact: '+18% pump load', risk: 'Moderate' },
        { name: 'Water shortage', impact: '-25% available volume', risk: 'High' },
        { name: 'Motor failure', impact: '12% capacity loss', risk: 'High' },
      ],
    },
    iot: {
      label: 'SIMULATED READINGS',
      sensors: [
        { name: 'Reservoir level', value: '68%', state: 'Normal' },
        { name: 'Pump A flow', value: '38 m3/h', state: 'Normal' },
        { name: 'Pump A temperature', value: '54 C', state: 'Watch' },
        { name: 'Pump A vibration', value: '2.1 mm/s', state: 'Normal' },
        { name: 'Water pH', value: '7.2', state: 'Normal' },
        { name: 'Turbidity', value: '3.1 NTU', state: 'Normal' },
      ],
    },
    maintenance: [
      { motor: 'Pump A', due: '14 days', recommendation: 'Inspect bearing and vibration sensor.', risk: 'Low' },
      { motor: 'Pump B', due: '3 days', recommendation: 'Verify motor temperature before next heavy run.', risk: 'Medium' },
      { motor: 'Pump C', due: 'Overdue', recommendation: 'Investigate offline motor and connectivity.', risk: 'High' },
    ],
    weather: {
      label: 'SIMULATED WEATHER',
      temperature: 28,
      humidity: 64,
      rainfall: 3.2,
      recommendation: 'Reduce non-essential irrigation after forecast rainfall.',
    },
  })
})

app.post('/api/ai/optimize', authorize, async (req, res) => {
  const available = Number(req.body.availableVolume)
  const data = await loadData()
  if (!Number.isFinite(available) || available <= 0) {
    return res.status(400).json({ error: 'availableVolume must be greater than zero' })
  }
  const farmers = data.farmers.filter((farmer) => farmer.status === 'Approved')
  const fairShare = available / Math.max(farmers.length, 1)
  const allocations = farmers.map((farmer) => ({
    farmer: farmer.name,
    requested: fairShare * (farmer.acreage / 10),
    recommended: Number(Math.min(fairShare * (farmer.acreage / 10), available).toFixed(1)),
    reason: 'Based on approved status, field area and available simulated capacity.',
  }))
  res.json({ mode: 'DEMONSTRATION', availableVolume: available, allocations })
})

app.patch('/api/motors/:id', authorize, async (req, res) => {
  if (!['Admin', 'Tubewell Owner'].includes(req.session.role)) {
    return res.status(403).json({ error: 'Motor operation is not permitted for this role' })
  }
  if (!['ON', 'OFF'].includes(req.body.state)) {
    return res.status(400).json({ error: 'State must be ON or OFF' })
  }
  const data = await loadData()
  const motor = data.motors.find((item) => item.id === req.params.id)
  if (!motor) return res.status(404).json({ error: 'Motor not found' })
  motor.state = req.body.state
  motor.flow = motor.state === 'ON' ? 38 : 0
  motor.voltage = motor.state === 'ON' ? 412 : 418
  data.activity.unshift({
    id: randomUUID(),
    message: `${motor.name} turned ${motor.state}`,
    type: 'motor',
    time: 'Just now',
  })
  await saveData(data)
  res.json(motor)
})

app.post('/api/farmer-requests', authorize, async (req, res) => {
  if (req.session.role !== 'Farmer') {
    return res.status(403).json({ error: 'Only farmers can create water requests' })
  }
  const volume = Number(req.body.volume)
  if (!Number.isFinite(volume) || volume <= 0 || volume > 100) {
    return res.status(400).json({ error: 'Volume must be between 1 and 100 cubic meters' })
  }
  const data = await loadData()
  const request = {
    id: `req-${randomUUID().slice(0, 8)}`,
    farmer: req.session.name,
    field: String(req.body.field || 'Assigned Field'),
    volume,
    status: 'Pending',
    date: new Date().toISOString().slice(0, 10),
  }
  data.requests.push(request)
  data.activity.unshift({
    id: randomUUID(),
    message: `${req.session.name} submitted a water request`,
    type: 'request',
    time: 'Just now',
  })
  await saveData(data)
  res.status(201).json(request)
})

app.patch('/api/farmer-requests/:id', authorize, async (req, res) => {
  if (req.session.role !== 'Admin' && req.session.role !== 'Tubewell Owner') {
    return res.status(403).json({ error: 'Approval is not permitted for this role' })
  }
  if (!['Approved', 'Rejected', 'Scheduled'].includes(req.body.status)) {
    return res.status(400).json({ error: 'Invalid request status' })
  }
  const data = await loadData()
  const request = data.requests.find((item) => item.id === req.params.id)
  if (!request) return res.status(404).json({ error: 'Request not found' })
  request.status = req.body.status
  await saveData(data)
  res.json(request)
})

app.listen(port, () => {
  console.log(`HYDROGRID backend listening on http://127.0.0.1:${port}`)
})
