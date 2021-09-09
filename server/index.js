require("dotenv").config();
const express = require("express")
const cors = require('cors')
const axios = require('axios')
const http = require("http");
const { Server } = require("socket.io");
const path = require('path')

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = new Server(server);

const getTokenFromRequest = request => {
  const auth = request.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer'))
    return auth.substring(7)
  return null
}

app.get("/login", async (req, res) => {
  const token = getTokenFromRequest(req)
  if (!token) res.send('fail')
  const decodedToken = (await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)).data
  console.log(decodedToken)
  res.status(200).end(); // TODO(Eric): send 200 if fine, else whatever
});

app.use(express.static(path.join(__dirname, '..', 'client', 'build')))
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
})

// SOCKETS
io.on('connection', socket => {
  socket.on('create game', user => {
    console.log(user.id)
  })
})

server.listen(process.env.PORT, () => {
  console.log("listening on port ", process.env.PORT);
});
