const express = require('express')
const cors = require('cors')
const axios = require('axios')
const path = require('path');
const middleware = require('./middleware')
const Game = require('./models/Game')
const { generateCards } = require('./utils/cards')
const { v4: uuidv4 } = require('uuid')

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


// {socketId: googleUserId}
global.users = {}

const app = express();
app.use(cors())
app.use(express.json())
app.use(middleware.getToken)


app.get("/api/login", async (req, res) => {
  const token = req.token
  if (!token) res.status(403).send('Access forbidden, token does not exist.')
  const decodedToken = (await axios
    .get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)).data
  res.status(200).end();
});

// create game
app.post('/api/games', (req, res) => {
  const gameUuid = uuidv4()
  games[gameUuid] = (new Game(gameUuid))
  res.status(201).json({ gameId: gameUuid })
})

//get rules
app.get('/api/rules/:gameId', (req, res) => {
  const gameId = req.params.gameId
  const game = games[gameId]
  res.json({ rules: game.rules })
})


// check if game valid
app.get('/api/games/:gameId', (req, res) => {
  const gameId = req.params.gameId
  if (games[gameId]) res.status(200).end()
  else res.status(400).json({ error: `Game code ${gameId} invalid` })
})

// create cards
app.post('/api/cards', (req, res) => {
  const gameId = req.body.gameId
  const game = games[gameId]
  const numOfPlayers = game.players.length
  const playersCards = generateCards(numOfPlayers)
  const socket = app.get('socket')

  game.players.forEach((player, i) => {
    player.cards = playersCards[i]
  })

  const playerCardsList = game.players
    .map(p => ({ gid: p.gid, cards: p.cards.length }))

  socket.io.of('/games').to(gameId).emit('cards info', playerCardsList)

  res.status(201).end()
})

// serve the website (PRODUCTION)
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})

module.exports = app