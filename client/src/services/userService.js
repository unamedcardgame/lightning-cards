import axios from "axios"

const login = async (tokenId) => {
  const response = await axios.get('/login', {
    headers: { Authorization: `bearer ${tokenId}` }
  })
  console.log(response.status)
  return response.status
}

const userService = {
  login,
}
export default userService