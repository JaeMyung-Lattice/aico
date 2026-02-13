import type { Server } from 'socket.io'

export const registerEvents = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      // Phase 2 PvP 확장점
    })
  })
}
