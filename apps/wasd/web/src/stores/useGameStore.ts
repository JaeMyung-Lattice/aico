import { create } from 'zustand'
import type { Room, Player, Key, GamePhase, GameState, Direction } from '@wasd/shared'

interface GameResult {
  deaths: number
  elapsedTime: number
}

const PREDICTION_GUARD_MS = 150

interface GameStore {
  roomCode: string | null
  players: Player[]
  myPlayerId: string | null
  myKeys: Key[]
  isHost: boolean
  gamePhase: GamePhase
  nickname: string
  gameState: GameState | null
  gameResult: GameResult | null
  predictionTime: number

  setNickname: (nickname: string) => void
  setMyPlayerId: (id: string) => void
  updateRoom: (room: Room) => void
  setMyKeys: (keys: Key[]) => void
  setGamePhase: (phase: GamePhase) => void
  setGameState: (state: GameState) => void
  applyPrediction: (direction: Direction) => void
  applyServerState: (state: GameState) => void
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
  gameResult: null as GameResult | null,
  predictionTime: 0,
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

  applyPrediction: (direction) => {
    const { gameState } = get()
    if (!gameState) return
    set({
      gameState: { ...gameState, direction, moving: true },
      predictionTime: Date.now(),
    })
  },

  applyServerState: (state) => {
    const { predictionTime, gameState: current } = get()
    const isPredictionActive = Date.now() - predictionTime < PREDICTION_GUARD_MS

    if (isPredictionActive && current) {
      set({
        gameState: { ...state, direction: current.direction, moving: current.moving },
        gamePhase: state.phase,
      })
    } else {
      set({ gameState: state, gamePhase: state.phase })
    }
  },

  setGameResult: (result) => set({ gameResult: result, gamePhase: 'complete' }),

  reset: () => set(initialState),
}))
