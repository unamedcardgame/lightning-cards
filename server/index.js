require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("test");
});

server.listen(process.env.PORT, () => {
  console.log("listening on port ", process.env.PORT);
});
