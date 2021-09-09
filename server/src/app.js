const express = require('express')
const cors = require('cors')
const axios = require('axios')
const path = require('path');
const middleware = require('./middleware')

const app = express();
app.use(cors())
app.use(express.json())
app.use(middleware.getToken)

app.get("/login", async (req, res) => {
  const token = req.token
  if (!token) res.status(403).send('fail')
  const decodedToken = (await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)).data
  res.status(200).end(); // TODO(Eric): send 200 if fine, else whatever
});

app.post('/createGame', (req, res) => {


})

app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})

module.exports = app