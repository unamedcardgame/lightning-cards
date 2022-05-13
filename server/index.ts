require("dotenv").config();
import app from './src/app'
import MySocket from './src/sockets/Socket';
import * as http from 'http'

const server = http.createServer(app)

// make the socket accessible from anywhere using app.get('socket')
app.set("socket", new MySocket(server))

server.listen(process.env.PORT, () => {
  console.log("listening on port ", process.env.PORT)
  process.env['NODE_ENV'] === 'production' ? console.log('WARNING!!!!!!!!!!!!!!!!!!!!!!!!. Use "npm run dev" for hot reload ! npm start is for production not development') : null
});

module.exports = server