// file for extracting data from the request
// and conveniently placing it into a variable,
// aka middlewares
const getToken = (req, res, next) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer'))
    req.token = auth.substring(7)
  else req.token = null
  next()
}

module.exports = {
  getToken,
}