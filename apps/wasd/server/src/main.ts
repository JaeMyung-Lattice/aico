import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import cors from 'cors'
import { registerRoomEvents } from './events/room-events.js'
import { registerGameEvents } from './events/game-events.js'

const CLIENT_ORIGIN = process.env['CLIENT_ORIGIN'] ?? 'http://localhost:5174'

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
  },
})

app.use(cors({ origin: CLIENT_ORIGIN }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

registerRoomEvents(io)
registerGameEvents(io)

const PORT = process.env['PORT'] ?? 4001

httpServer.listen(PORT, () => {
  console.log(`WASD server running on port ${PORT}`)
})
