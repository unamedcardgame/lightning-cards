const Player = require("../models/Player")

function setHandlers(io) {
  // main handler
  io.of('/games').on('connection', socket => {

    socket.leave(socket.id) // leave the default room

    // Lobby handlers
    socket.on('join', game => {
      socket.join(game.gameId)

      // 'games' is a global variable declared in app.js
      if (game.isHost) games[game.gameId].setHost(game.userId)
      games[game.gameId].addPlayer(new Player(game.userId))
      // map google's userId to socket's internal id
      users[socket.id] = game.userId

      // tell the player he joined the game
      socket.emit('joined')

      // TODO(Disha): emit a message to ALL players in the room that
      // this player with this id has joined. For now do only id,
      // for sending the name we'll do later.
      // io.of('/games').emit or something like that
    })

    // game actions handler
    socket.on('start game', (game) => {
      games[game.gameId].startGame()
    })

    socket.on('draw card', game => {

    })

    // Debug handler
    socket.on('get details', () => {
      console.log(io.of('/games').sockets.get(socket.id).adapter.rooms)
    })

  })
}

module.exports = setHandlers