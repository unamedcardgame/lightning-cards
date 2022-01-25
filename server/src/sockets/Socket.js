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
    this.io = socketIo(server, {
      cors: {
        origin: '*',
      }
    });
    setHandlers(this.io)
  }
}

module.exports = Socket;
