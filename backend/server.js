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
