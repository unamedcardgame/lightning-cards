const socketIo = require('socket.io');
const Game = require('../models/Game');
const setHandlers = require('../sockets/socketController')

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
    setHandlers(this.io)
  }

  // method for emitting in an express endpoint (inside app.use(...))
  emiter(event, body, room) {
    this.io.of('/games').to(room).emit(event, body)
  }
}

module.exports = Socket;
