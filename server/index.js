require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require('path')

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/api", (req, res) => {
  res.send("test");
});

app.use(express.static(path.join(__dirname, '..', 'client', 'build')))
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
})

server.listen(process.env.PORT, () => {
  console.log("listening on port ", process.env.PORT);
});
