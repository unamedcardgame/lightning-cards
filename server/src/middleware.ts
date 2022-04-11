import express from "express";

const getToken = (req: any, res: express.Response, next: express.NextFunction) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer'))
    req.token = auth.substring(7)
  else req.token = null
  next()
}

export { getToken }