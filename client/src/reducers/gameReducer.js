import { cloneDeep } from 'lodash'

const initialState = {
  id: null,
  players: {},
  host: false,
}

// CONSIDER A MAP RATHER THAN AN AN OBJECT TO MAINTAIN ORDER

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_HOST':
      return { ...state, host: true }
    case 'ADD_PLAYER':
      const playerName = action.payload.name
      const playerSid = action.payload.sid
      return { ...state, players: { ...state.players, [playerSid]: { name: playerName } } }
    case 'SET_ID':
      const id = action.payload
      return { ...state, id }
    case 'SET_CARDS':
      const newPlayers = cloneDeep(state.players)
      action.payload.forEach(p => newPlayers[p.sid].cards = p.cards)
      return { ...state, players: newPlayers }
    case 'DRAW_CARD':
      return {
        ...state, players: { ...state.players, [action.payload.playerSid]: { ...state.players[action.payload.playerSid], cards: state.players[action.payload.playerSid].cards - 1 } }
      }
    default:
      return state
  }
}

// actions
export const setHost = () => {
  return { type: 'SET_HOST' }
}

export const setGameId = (id) => {
  return { type: 'SET_ID', payload: id }
}

export const addPlayer = player => {
  return { type: 'ADD_PLAYER', payload: player }
}

export const setCardLengths = cardsList => {
  return { type: 'SET_CARDS', payload: cardsList }
}

export const updatePlayerCards = player => {
  return { type: 'DRAW_CARD', payload: { playerSid: player } }
}

export default gameReducer