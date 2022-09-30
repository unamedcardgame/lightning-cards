import axios from "axios"

const baseUrl = process.env['NODE_ENV'] === 'development' ? '' : 'https://lightning-cards-backend.onrender.com'

const login = async (tokenId) => {
  const response = await axios.get(`${baseUrl}/api/login`, {
    headers: { Authorization: `bearer ${tokenId}` }
  })
  return response.status
}

const userService = {
  login,
}
export default userService