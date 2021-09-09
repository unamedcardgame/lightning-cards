require("dotenv").config();
const http = require("http");
const app = require('./src/app')

const server = http.createServer(app)

server.listen(process.env.PORT, () => {
  console.log("listening on port ", process.env.PORT);
});
