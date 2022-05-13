import { cloneDeep } from 'lodash'
import Game from '../models/Game'
import Gesture from '../models/Gesture'
import Player from '../models/Player'
import Reaction from '../models/Reaction'

export const initialGameState: Game = {
  id: '',
  players: {},
  host: false,
  reactionReady: false,
  roundLoser: {} as { name: string, reaction: Reaction },
  winner: {} as { name: string, gid: string },
  rules: undefined,
  reacted: false,
}

// CONSIDER A MAP RATHER THAN AN AN OBJECT TO MAINTAIN ORDER

const gameReducer = (state: Game, action: Action): Game => {
  switch (action.type) {
    case 'SET_HOST':
      return { ...state, host: true }
    case 'ADD_PLAYER': {
      const playerName = action.payload.name
      const playerGid = action.payload.gid
      return {
        ...state, players: {
          ...state.players, [playerGid]: {
            name: playerName,
            turn: Object.keys(state.players).length === 0 ? true : false,
            gid: playerGid
          }
        }
      }
    }
    case 'REMOVE_PLAYER': {
      const playerGid = action.payload.playerGid
      const newPlayers = cloneDeep(state.players)
      delete newPlayers[playerGid]
      return { ...state, players: newPlayers }
    }
    case 'SET_PLAYER_TURN': {
      console.log('SPT IS ', action.payload)
      const newPlayers = cloneDeep(state.players)
      for (let p in newPlayers) {
        newPlayers[p].turn = p === action.payload
      }
      return {
        ...state, players: { ...newPlayers }
      }
    }
    case 'SET_ID': {
      const id = action.payload
      return { ...state, id }
    }
    case 'SET_CARDS_LENGTH': {
      const newPlayersTurns = cloneDeep(state.players)
      console.log('PLAYERS STATE: ', newPlayersTurns)
      action.payload.forEach((p: Player) => newPlayersTurns[p.gid].cards = p.cards)
      return { ...state, players: newPlayersTurns }
    }
    case 'ADD_LOSER_DETAILS': {
      const currCardsLength = state.players[action.payload.gid].cards
      return {
        ...state,
        players: { ...state.players, [action.payload.gid]: { ...state.players[action.payload.gid], cards: currCardsLength + action.payload.cards } },
        roundLoser: { name: action.payload.name, reaction: action.payload.reaction }
      }
    }
    case 'SET_REACTED':
      return {
        ...state,
        reacted: action.payload
      }
    case 'SET_GESTURES': {
      const { gid, result, gesture } = action.payload
      return { ...state, players: { ...state.players, [gid]: { ...state.players[gid], reaction: { result, gesture } } } }
    }
    case 'DRAW_CARD':
      return {
        ...state, players: { ...state.players, [action.payload.playerGid]: { ...state.players[action.payload.playerGid], cards: state.players[action.payload.playerGid].cards - 1 } }
      }
    case 'SET_REACTION_READY':
      return {
        ...state, reactionReady: action.payload
      }
    case 'SET_WINNER':
      return {
        ...state,
        winner: action.payload
      }
    case 'SET_RULES':
      return {
        ...state,
        rules: action.payload
      }
    default:
      return state
  }
}

// actions
export const setHost = () => {
  return { type: 'SET_HOST' }
}

export const setGameId = (id: string) => {
  return { type: 'SET_ID', payload: id }
}

export const addPlayer = (player: Player) => {
  return { type: 'ADD_PLAYER', payload: player }
}

export const setCardLengths = (cardsList: number) => {
  return { type: 'SET_CARDS_LENGTH', payload: cardsList }
}

export const setRoundLoser = (loser: Player) => {
  return { type: 'ADD_LOSER_DETAILS', payload: loser }
}

export const updatePlayerCards = (player: string) => {
  return { type: 'DRAW_CARD', payload: { playerGid: player } }
}

export const setReacted = (reacted: boolean) => {
  return { type: 'SET_REACTED', payload: reacted }
}

export const setGesture = (obj: Gesture) => {
  return { type: 'SET_GESTURES', payload: obj }
}

export const setReactionReady = (status: boolean) => {
  return { type: 'SET_REACTION_READY', payload: status }
}

export const setWinner = (winner: { name: string, gid: string }) => {
  return { type: 'SET_WINNER', payload: winner }
}

export const setRules = (rules: any) => {
  return { type: 'SET_RULES', payload: rules }
}

export const setPlayerTurn = (player: { nextTurnGid: string }) => {
  return { type: 'SET_PLAYER_TURN', payload: player.nextTurnGid }
}

export const removePlayer = (playerGid: string) => {
  return { type: 'REMOVE_PLAYER', payload: { playerGid } }
}

enum ActionKind {
  SetHost = 'SET_HOST',
  SetID = 'SET_ID',
  AddPlayer = 'ADD_PLAYER',
  SetCardsLength = 'SET_CARDS_LENGTH',
  AddLoserDetails = 'ADD_LOSER_DETAILS',
  DrawCard = 'DRAW_CARD',
  SetReacted = 'SET_REACTED',
  SetGestures = 'SET_GESTURES',
  SetReactionReady = 'SET_REACTION_READY',
  SetWinner = 'SET_WINNER',
  SetRules = 'SET_RULES',
  SetPlayerTurn = 'SET_PLAYER_TURN',
  RemovePlayer = 'REMOVE_PLAYER'
}

export interface Action {
  type: ActionKind,
  payload: any
}


export default gameReducer
