import { create } from 'zustand'
import type { Room, Player, Key, GamePhase, GameState, DeathEvent } from '@wasd/shared'

interface GameResult {
  deaths: number
  elapsedTime: number
}

interface GameStore {
  roomCode: string | null
  players: Player[]
  myPlayerId: string | null
  myKeys: Key[]
  isHost: boolean
  gamePhase: GamePhase
  nickname: string
  gameState: GameState | null
  deathEvent: DeathEvent | null
  gameResult: GameResult | null

  setNickname: (nickname: string) => void
  setMyPlayerId: (id: string) => void
  updateRoom: (room: Room) => void
  setMyKeys: (keys: Key[]) => void
  setGamePhase: (phase: GamePhase) => void
  setGameState: (state: GameState) => void
  setDeathEvent: (event: DeathEvent | null) => void
  setGameResult: (result: GameResult) => void
  reset: () => void
}

const initialState = {
  roomCode: null as string | null,
  players: [] as Player[],
  myPlayerId: null as string | null,
  myKeys: [] as Key[],
  isHost: false,
  gamePhase: 'lobby' as GamePhase,
  nickname: '',
  gameState: null as GameState | null,
  deathEvent: null as DeathEvent | null,
  gameResult: null as GameResult | null,
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  setNickname: (nickname) => set({ nickname }),

  setMyPlayerId: (id) => set({ myPlayerId: id }),

  updateRoom: (room) => {
    const { myPlayerId } = get()
    const myPlayer = room.players.find((p) => p.id === myPlayerId)
    set({
      roomCode: room.code,
      players: room.players,
      isHost: room.hostId === myPlayerId,
      gamePhase: room.phase,
      myKeys: myPlayer?.keys ?? get().myKeys,
    })
  },

  setMyKeys: (keys) => set({ myKeys: keys }),

  setGamePhase: (phase) => set({ gamePhase: phase }),

  setGameState: (state) => set({ gameState: state, gamePhase: state.phase }),

  setDeathEvent: (event) => set({ deathEvent: event }),

  setGameResult: (result) => set({ gameResult: result, gamePhase: 'complete' }),

  reset: () => set(initialState),
}))
