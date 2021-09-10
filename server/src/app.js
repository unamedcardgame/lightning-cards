const express = require('express')
const cors = require('cors')
const axios = require('axios')
const path = require('path');
const middleware = require('./middleware')
const Game = require('./models/Game')

/*
  Games structure
  games = {
    {gameId1},
    {gameId2},
    {gameId3}
  }

  refer Game.js for class
*/
global.games = {}
let gameCounter = 0 // for temporary gameId implementation

// pay no attention
const app = express();
app.use(cors())
app.use(express.json())
app.use(middleware.getToken)


app.get("/login", async (req, res) => {
  const token = req.token
  if (!token) res.status(403).send('fail')
  const decodedToken = (await axios
    .get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)).data
  res.status(200).end();
});

app.post('/createGame', (req, res) => {
  games[gameCounter] = (new Game(gameCounter))
  res.status(201).json({ gameId: gameCounter++ })
})

// TODO(Disha): return 201 like above after verifying
// whether gameId exists in games dictionary
app.get('/joinGame', (req, res) => {
  const gameId = req.get('gameId')

  // verify existence
  if (games.get(gameId)) null
})

// serve the website (FOR PRODUCTION)
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})

module.exports = app