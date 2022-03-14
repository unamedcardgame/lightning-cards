// file for extracting data from the request
// and conveniently placing it into a variable,
// aka middlewares
import express from "express";

const getToken = (req: any, res: express.Request, next: express.NextFunction) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer'))
    req.token = auth.substring(7)
  else req.token = null
  next()
}

module.exports = {
  getToken,
}