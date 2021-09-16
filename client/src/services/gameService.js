import axios from 'axios'

const createGame = async (uid) => {
  let data, status
  try {
    ({ data, status } = await axios.post('/api/games', { uid }))
  } catch (e) {
    throw new Error(e.response.data.error)
  }
  return { data, status }
}

const joinGame = async (gameId) => {
  let status
  try {
    ({ status } = await axios.get(`/api/games/${gameId}`))
  } catch (e) {
    throw new Error(e.response.data.error)
  }
  return status
}

const gameService = {
  createGame,
  joinGame,
}

export default gameService