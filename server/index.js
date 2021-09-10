require("dotenv").config();
const app = require('./src/app')
const Socket = require('./src/sockets/Socket')
const http = require('http')

const server = http.createServer(app)

// make the socket accessible from anywhere using app.get('socket')
app.set("socket", new Socket(server))

server.listen(process.env.PORT, () => {
  console.log("listening on port ", process.env.PORT);
});

module.exports = server