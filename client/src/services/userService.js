import axios from "axios"

const login = async (tokenId) => {
  const response = await axios.get('/login', {
    headers: { Authorization: `bearer ${tokenId}` }
  })
  return response.status
}

const userService = {
  login,
}
export default userService