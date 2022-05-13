import { Server } from "socket.io";
import setHandlers from "./socketController";
import * as http from 'http'

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