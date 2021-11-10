import axios from 'axios'

const baseUrl = process.env['NODE_ENV'] === 'development' ? '' : 'https://lightning-cards-api.herokuapp.com'

const createGame = async (uid) => {
  let data, status
  try {
    ({ data, status } = await axios.post(`${baseUrl}/api/games`, { uid }))
  } catch (e) {
    throw new Error(e.response.data.error)
  }
  return { data, status }
}

const joinGame = async (gameId) => {
  let status
  try {
    ({ status } = await axios.get(`${baseUrl}/api/games/${gameId}`))
  } catch (e) {
    throw new Error(e.response.data.error)
  }
  return status
}

const getRules = async (gameId) => {
  let rules
  try {
    ({ rules } = await axios.get(`${baseUrl}/api/rules`, { gameId }))
  } catch (e) {
    throw new Error(e.response.data.error)
  }

  return rules
}

const getCards = async (gameId) => {
  let status
  try {
    ({ status } = await axios.post(`${baseUrl}/api/cards`, { gameId }))
  } catch (e) {
    throw new Error(e.response.data.error)
  }

  return status
}

const gameService = {
  createGame,
  joinGame,
  getCards,
  getRules,
}

export default gameService