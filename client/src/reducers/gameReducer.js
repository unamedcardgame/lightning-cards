import { cloneDeep } from 'lodash'

const initialState = {
  id: null,
  players: {},
  host: false,
  reactionReady: false,
  roundLoser: '',
  reaction: undefined,
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
    case 'SET_CARDS_LENGTH':
      const newPlayers = cloneDeep(state.players)
      action.payload.forEach(p => newPlayers[p.sid].cards = p.cards)
      return { ...state, players: newPlayers }
    case 'ADD_LOSER_DETAILS':
      const currCardsLength = state.players[action.payload.sid].cards
      console.log('ccl ', currCardsLength, 'name: ', action.payload.name)
      return {
        ...state,
        players: { ...state.players, [action.payload.sid]: { ...state.players[action.payload.sid], cards: currCardsLength + action.payload.cards } },
        roundLoser: action.payload.name
      }
    case 'SET_REACTED':
      return {
        ...state,
        reacted: action.payload
      }
    case 'SET_GESTURES':
      const { result, gesture } = action.payload
      return { ...state, reaction: { result, gesture } }
    case 'RESET_GESTURE':
      return { ...state, reaction: undefined }
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
  return { type: 'SET_CARDS_LENGTH', payload: cardsList }
}

export const setRoundLoser = loser => {
  return { type: 'ADD_LOSER_DETAILS', payload: loser }
}

export const updatePlayerCards = player => {
  return { type: 'DRAW_CARD', payload: { playerSid: player } }
}

export const setReacted = reacted => {
  return { type: 'SET_REACTED', payload: reacted }
}

export const setGesture = obj => {
  return { type: 'SET_GESTURES', payload: obj }
}

export const resetGesture = () => {
  return { type: 'RESET_GESTURE' }
}

export const setReactionReady = status => {
  return { type: 'SET_REACTION_READY', payload: status }
}

export default gameReducer