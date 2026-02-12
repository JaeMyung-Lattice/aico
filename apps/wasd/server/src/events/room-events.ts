import type { Server, Socket } from 'socket.io'
import type { GamePhase } from '@wasd/shared'
import { SocketEvents, MIN_PLAYERS } from '@wasd/shared'
import { roomManager } from '../rooms/room-manager.js'
import { assignKeys } from '../rooms/key-assigner.js'
import { GameLoop, gameLoops } from '../engine/game-loop.js'

export const registerRoomEvents = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Connected: ${socket.id}`)

    socket.on(SocketEvents.CREATE_ROOM, ({ nickname }: { nickname: string }) => {
      const trimmed = typeof nickname === 'string' ? nickname.trim() : ''
      if (trimmed.length < 1 || trimmed.length > 10) {
        socket.emit(SocketEvents.ERROR, { message: '닉네임은 1~10자여야 합니다.' })
        return
      }
      const room = roomManager.createRoom(socket.id, trimmed)
      socket.join(room.code)
      socket.emit(SocketEvents.ROOM_UPDATED, room)
    })

    socket.on(SocketEvents.JOIN_ROOM, ({ code, nickname }: { code: string; nickname: string }) => {
      const trimmed = typeof nickname === 'string' ? nickname.trim() : ''
      if (trimmed.length < 1 || trimmed.length > 10) {
        socket.emit(SocketEvents.ERROR, { message: '닉네임은 1~10자여야 합니다.' })
        return
      }
      const room = roomManager.joinRoom(code, socket.id, trimmed)
      if (!room) {
        socket.emit(SocketEvents.ERROR, { message: '방을 찾을 수 없거나 참가할 수 없습니다.' })
        return
      }
      socket.join(room.code)
      io.to(room.code).emit(SocketEvents.ROOM_UPDATED, room)
    })

    socket.on(SocketEvents.LEAVE_ROOM, () => {
      const room = roomManager.getRoomByPlayerId(socket.id)
      if (!room) return
      socket.leave(room.code)

      const existingLoop = gameLoops.get(room.code)
      if (existingLoop) {
        existingLoop.stop()
        gameLoops.delete(room.code)
      }

      const updatedRoom = roomManager.leaveRoom(room.code, socket.id)
      if (updatedRoom) {
        const resetRoom = room.phase !== 'lobby'
          ? { ...updatedRoom, phase: 'lobby' as GamePhase }
          : updatedRoom
        if (resetRoom !== updatedRoom) {
          roomManager.updateRoom(room.code, resetRoom)
        }
        io.to(room.code).emit(SocketEvents.ROOM_UPDATED, resetRoom)
      }
    })

    socket.on(SocketEvents.SOLO_START, ({ nickname }: { nickname: string }) => {
      const trimmed = typeof nickname === 'string' ? nickname.trim() : ''
      if (trimmed.length < 1 || trimmed.length > 10) {
        socket.emit(SocketEvents.ERROR, { message: '닉네임은 1~10자여야 합니다.' })
        return
      }

      const room = roomManager.createRoom(socket.id, trimmed)
      socket.join(room.code)

      const assignments = assignKeys([socket.id])
      const updatedPlayers = room.players.map((player) => {
        const assignment = assignments.find((a) => a.playerId === player.id)
        return { ...player, keys: assignment?.keys ?? [] }
      })

      const updatedRoom = {
        ...room,
        players: updatedPlayers,
        phase: 'playing' as GamePhase,
      }
      roomManager.updateRoom(room.code, updatedRoom)

      socket.emit(SocketEvents.GAME_STARTED, {
        room: updatedRoom,
        assignments,
      })

      const gameLoop = new GameLoop(room.code, io)
      gameLoops.set(room.code, gameLoop)
      gameLoop.start()
    })

    socket.on(SocketEvents.START_GAME, () => {
      const room = roomManager.getRoomByPlayerId(socket.id)
      if (!room) return
      if (room.hostId !== socket.id) return
      if (room.phase !== 'lobby') return
      if (room.players.length < MIN_PLAYERS) return

      const assignments = assignKeys(room.players.map((p) => p.id))
      const updatedPlayers = room.players.map((player) => {
        const assignment = assignments.find((a) => a.playerId === player.id)
        return { ...player, keys: assignment?.keys ?? [] }
      })

      const updatedRoom = {
        ...room,
        players: updatedPlayers,
        phase: 'playing' as GamePhase,
      }
      roomManager.updateRoom(room.code, updatedRoom)

      io.to(room.code).emit(SocketEvents.GAME_STARTED, {
        room: updatedRoom,
        assignments,
      })

      const gameLoop = new GameLoop(room.code, io)
      gameLoops.set(room.code, gameLoop)
      gameLoop.start()
    })

    socket.on('disconnect', () => {
      console.log(`Disconnected: ${socket.id}`)
      const room = roomManager.getRoomByPlayerId(socket.id)
      if (!room) return

      const existingLoop = gameLoops.get(room.code)
      if (existingLoop) {
        existingLoop.stop()
        gameLoops.delete(room.code)
      }

      const updatedRoom = roomManager.leaveRoom(room.code, socket.id)
      if (updatedRoom) {
        const resetRoom = room.phase !== 'lobby'
          ? { ...updatedRoom, phase: 'lobby' as GamePhase }
          : updatedRoom
        if (resetRoom !== updatedRoom) {
          roomManager.updateRoom(room.code, resetRoom)
        }
        io.to(room.code).emit(SocketEvents.ROOM_UPDATED, resetRoom)
        io.to(room.code).emit(SocketEvents.PLAYER_DISCONNECTED, { playerId: socket.id })
      }
    })
  })
}
