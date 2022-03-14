import { Server } from "socket.io";
const setHandlers = require('../sockets/socketController')
import * as http from 'http'

/* Socket.io rooms and namespace structure

  /games
        -- {game0}
        -- {game1}
        --   ...

*/
export default class MySocket {
  io: Server
  constructor(server: http.Server) {
    // create an io instance
    this.io = new Server(server, {
      cors: {
        origin: '*',
      }
    });
    setHandlers(this.io)
  }
}