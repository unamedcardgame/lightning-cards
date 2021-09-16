const socketIo = require('socket.io');
const Game = require('../models/Game');

/* Socket.io rooms and namespace structure

  /games
        -- {game0}
        -- {game1}
        --   ...

*/

class Socket {
  io

  constructor(server) {
    // create an io instance
    this.io = socketIo(server);

    // main handler
    this.io.of('/games').on('connection', socket => {

      socket.leave(socket.id) // leave the default room

      // Lobby handlers
      socket.on('join', game => {
        // TODO(Disha): when gameId is randomly generated don't use parseInt
        socket.join(game.gameId)

        // 'games' is a global variable declared in app.js
        if (game.isHost) games[game.gameId].setHost(game.userId)
        games[game.gameId].addPlayer(game.userId)
        // map google's userId to socket's internal id
        users[socket.id] = game.userId

        // tell the player he joined the game
        socket.emit('joined')

        // TODO(Disha): emit a message to ALL players in the room that
        // this player with this id has joined. For now do only id,
        // for sending the name we'll do later.
        // this.io.of('/games').emit or something like that
      })

      // game actions handler
      socket.on('start game', (game) => {
        games[game.gameId].startGame()
      })
      
      socket.on('draw card', game => {
        
      })

      // Debug handler
      socket.on('get details', () => {
        console.log(this.io.of('/games').sockets.get(socket.id).adapter.rooms)
      })

    })
  }

  // method for emitting in an express endpoint (inside app.use(...))
  emiter(event, body) {
    if (body)
      this.io.emit(event, body)
  }
}

module.exports = Socket;
