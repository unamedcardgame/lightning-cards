// JUNK FILE FOR REFACTORING PURPOSES, NOT USED ANYWHERE
io.on('connection', socket => {
  socket.on('create game', user => {
    games.push(new Game(gameIdGen, new Player(user.id)))
    idToGame[user.id] = gameIdGen++
  })
})
const Player = require('./src/models/Player')
let gameIdGen = 0
const idToGame = {}
const games = []
// game id generator
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}