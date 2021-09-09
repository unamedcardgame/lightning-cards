require("dotenv").config();
const Player = require('./models/Player')
const Game = require('./models/Game')
const express = require("express")
const cors = require('cors')
const axios = require('axios')
const http = require("http");
const { Server } = require("socket.io");
const path = require('path')

let gameIdGen = 0
const idToGame = {}
const games = []

// game id generator
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = new Server(server);

const getTokenFromRequest = request => {
  const auth = request.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer'))
    return auth.substring(7)
  return null
}

app.get("/login", async (req, res) => {
  const token = getTokenFromRequest(req)
  if (!token) res.status(403).send('fail')
  const decodedToken = (await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)).data
  console.log(decodedToken)
  res.status(200).end(); // TODO(Eric): send 200 if fine, else whatever
});

app.get('/createGame', (req, res) => {
  // TODO(Eric): json middleware parser ?
})

app.use(express.static(path.join(__dirname, '..', 'client', 'build')))
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
})

// SOCKETS
io.on('connection', socket => {
  socket.on('create game', user => {
    games.push(new Game(gameIdGen, new Player(user.id)))
    idToGame[user.id] = gameIdGen++
    console.log(games)
  })
})

server.listen(process.env.PORT, () => {
  console.log("listening on port ", process.env.PORT);
});
