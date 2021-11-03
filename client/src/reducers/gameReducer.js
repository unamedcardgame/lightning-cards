import { cloneDeep } from 'lodash'

const initialState = {
  id: null,
  players: {},
  host: false,
  reactionReady: false,
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
    case 'SET_GESTURES':
      const { result, gesture } = action.payload
      return { ...state, reaction: { result, gesture } }
    case 'DRAW_CARD':
      return {
        ...state, players: { ...state.players, [action.payload.playerSid]: { ...state.players[action.payload.playerSid], cards: state.players[action.payload.playerSid].cards - 1 } }
      }
    case 'SET_REACTION_READY':
      return {
        ...state, reactionReady: action.payload
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

export const setGesture = obj => {
  return { type: 'SET_GESTURES', payload: obj }
}

export const setReactionReady = status => {
  return { type: 'SET_REACTION_READY', payload: status }
}

export default gameReducer