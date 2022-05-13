import express from "express";
import cors from "cors"
import axios from "axios";
import path from "path";
import * as middleware from "./middleware";
import generateCards from "./utils/cards";
import { v4 as uuidv4 } from 'uuid'
import Game from "./models/Game";
import Games from "./models/Games";

const globalAny: any = global;


const games: Games = {}

globalAny.games = games;
globalAny.users = {}

const app = express();
app.use(cors())
app.use(express.json())
app.use(middleware.getToken)


app.get("/api/login", async (req: any, res: express.Response) => {
  const token = req.token
  if (!token) res.status(403).send('Access forbidden, token does not exist.')
  const decodedToken = (await axios
    .get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)).data
  res.status(200).end();
});

// create game
app.post('/api/games', (req: express.Request, res: express.Response) => {
  const gameUuid = uuidv4()
  games[gameUuid] = (new Game(gameUuid))
  res.status(201).json({ gameId: gameUuid })
})

//get rules
app.get('/api/rules/:gameId', (req: express.Request, res: express.Response) => {
  const gameId = req.params.gameId
  const game = games[gameId]
  res.json({ rules: game.rules })
})


// check if game valid
app.get('/api/games/:gameId', (req: express.Request, res: express.Response) => {
  const gameId = req.params.gameId
  if (games[gameId]) res.status(200).end()
  else res.status(400).json({ error: `Game code ${gameId} invalid` })
})

// create cards
app.post('/api/cards', (req: express.Request, res: express.Response) => {
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

export default app