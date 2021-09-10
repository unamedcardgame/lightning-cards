import axios from 'axios'

const createGame = async (uid) => {
  const res = await axios.post('/createGame', { uid })
  return res
}

const gameService = {
  createGame,
}

export default gameService