export const SocketEvents = {
  // Room
  CREATE_ROOM: 'create-room',
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  ROOM_UPDATED: 'room-updated',
  START_GAME: 'start-game',
  GAME_STARTED: 'game-started',
  PLAYER_DISCONNECTED: 'player-disconnected',

  // Game
  INPUT: 'input',
  GAME_STATE: 'game-state',
  DEATH: 'death',
  STAGE_CLEAR: 'stage-clear',
  GAME_COMPLETE: 'game-complete',

  // Error
  ERROR: 'error',
} as const
