const Player = require("../models/Player")

/*
  Namespace - /games, /comms
  Rooms - /[some_game_id]
*/

function setHandlers(io) {
  // main handler
  io.of('/games').on('connection', socket => {

    // Lobby handlers
    socket.on('join', data => {
      const gameId = data.game.gameId
      socket.join(gameId)

      // 'games' is a global variable declared in app.js
      if (data.game.isHost) {
        games[gameId].setHost(data.user.userId)
      }
      // add player to game
      games[gameId].addPlayer(new Player(data.user.userId, socket.id, data.user.name, data.game.isHost ? true : false))

      // send back a list of players in lobby to the new player
      const playerList = games[gameId]
        .players
        .map(p => ({ name: p.name, sid: p.sid }))
      io.of('/games').to(socket.id).emit('player list', playerList)


      // map google's userId to socket's internal id
      users[socket.id] = data.user.userId

      // tell the player he joined the game
      socket.emit('joined')

      // tell all the other players a new player has arrived
      socket.to(gameId).emit('new player', { name: data.user.name, sid: socket.id })
    })

    socket.on('ready', (details) => {
      games[details.gameId]
        .players
        .find(p => p.sid === details.sid)
        .makeReady()

      console.log(games[details.gameId].players.find(p => p.sid === details.sid).ready)
    })

    // Game handlers
    socket.on('start game', (game) => {
      if (!games[game.gameId].isEveryoneReady()) {
        const unreadyList = games[game.gameId].players.filter(p => p.ready === false)
        socket.emit('unready', unreadyList)
        return
      }
      games[game.gameId].startGame()

      io.of('/games').in(game.gameId).emit('begin')
    })

    socket.on('draw card', user => {
      const { sid, gameId } = user

      // validate whether sid === current player's turn ka sid
      // games[gameId].currentTurn === sid

      // get sid's top card
      const card = games[gameId].players
        .find(p => p.sid === sid)
        .cards
        .splice(0, 1)[0]
      io.of('/games').in(gameId).emit('draw pile', { card })

      // notify room that player drew card
      io.of('/games').in(gameId).emit('player drew', sid)
    })

    // Debug handlers

  })
}

module.exports = setHandlers