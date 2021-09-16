const Player = require("../models/Player")

function setHandlers(io) {
  // main handler
  io.of('/games').on('connection', socket => {

    // Lobby handlers
    socket.on('join', data => {
      socket.join(data.game.gameId)

      // 'games' is a global variable declared in app.js
      if (data.game.isHost) games[data.game.gameId].setHost(data.user.userId)
      games[data.game.gameId].addPlayer(new Player(data.user.userId, socket.id))
      // map google's userId to socket's internal id
      users[socket.id] = data.user.userId

      // tell the player he joined the game
      socket.emit('joined')

      // TODO(Disha): emit a message to ALL players in the room that
      // this player with this id has joined. For now do only id,
      // for sending the name we'll do later.
      // io.of('/games').emit or something like that
      socket.to(data.game.gameId).emit('new player', { name: data.user.name })
    })

    // game action handlers
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