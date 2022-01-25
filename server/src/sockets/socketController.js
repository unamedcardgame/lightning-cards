const Player = require("../models/Player");
const { declareLoser, checkForWinner } = require('../utils/gameService')

let prevTimeout = undefined

/*
  Namespace - /games, /comms
  Rooms - /[some_game_id]
*/

function setHandlers(io) {
  // on new socket connection
  io.of('/games').on('connection', socket => {

    // Lobby handlers
    socket.on('join', data => {
      const gameId = data.game.gameId
      socket.join(gameId)

      // 'games' is a global variable declared in app.js
      if (data.game.isHost) {
        games[gameId].setHost(data.user.id)
      }
      // add player to game
      games[gameId].addPlayer(new Player(data.user.id, data.user.name, data.game.isHost || false))

      // send back a list of players in lobby to the new player
      const playerList = games[gameId]
        .players
        .map(p => ({ name: p.name, gid: p.gid }))
      io.of('/games').to(socket.id).emit('player list', playerList)


      // map google's id to socket's internal id
      users[socket.id] = { gid: data.user.id, gameId }

      // tell all the other players a new player has arrived
      socket.broadcast.to(gameId).emit('new player', { name: data.user.name, gid: data.user.id })
    })

    socket.on('ready', (details) => {
      games[details.gameId]
        .players
        .find(p => p.gid === details.gid)
        .makeReady()
    })

    // Game handlers
    socket.on('start game', (gameId) => {
      if (!games[gameId].isEveryoneReady()) {
        const unreadyList = games[gameId].players.filter(p => p.ready === false).map(p => ({ name: p.name, gid: p.gid }))
        socket.emit('unready', unreadyList)
      } else {
        games[gameId].startGame()
        io.of('/games').in(gameId).emit('begin')
      }
    })

    socket.on('draw card', user => {
      const { gid, gameId } = user
      let currentvalue = games[gameId].getCurrentTurn()

      // get gid's top card
      // validate whether gid === current player's turn ka gid
      // games[gameId].currentTurn === gid
      if (gid === games[gameId].players[currentvalue].gid) {
        // get gid's top card
        const card = games[gameId].players
          .find(p => p.gid === gid)
          .cards
          .splice(0, 1)[0]
        io.of('/games').in(gameId).emit('draw pile', { card })
        games[gameId].addToCenterDeck(card)

        // TODO(): Round in progress for face card
        if (['K', 'Q', 'A', 'T', 'J'].some(c => c === card[0])) {
          // clear prev timer
          if (prevTimeout) {
            clearInterval(prevTimeout)
            prevTimeout = undefined
          }
          // start timer
          /*           prevTimeout = setTimeout(() => {
                      console.log('to')
                      const loser = games[gameId]
                        .players
                        .find(p => p.turnCompleted === false)
          
                      if (loser) {
                        declareLoser(loser, games[gameId], gameId, games[gameId].centerCards.length, io, true, "slowpoke")
                      }
                    }, 8000) // ROUND TIMEOUT */
        }

        // notify room that player drew card
        const turn = games[gameId].nextTurn()
        io.of('/games').in(gameId).emit('player drew', { gid, nextTurnGid: games[gameId].players[turn].gid })
      }
      else {
        // TODO(): Send to frontend to display not your turn or something ?
      }


    })

    socket.on('gesture', reaction => {
      const { gameId, gid } = reaction
      console.log("BRUUUUUUUUUUUUUUUUUUUUUH' gid: ", gid)
      let player = games[gameId]
        .players
        .find(p => p.gid === gid)
      // if undefined gesture or player reacted already, ignore
      if (!reaction.reaction.gesture || player.turnCompleted || games[gameId].centerCards.length === 0) return

      console.log('player is', player)


      let curLetter = games[gameId].currentCard?.substring(0, 1)
      const numberOfCenterCards = games[gameId].centerCards.length
      let everyoneReacted = false

      console.log('center react: ', curLetter, 'my react: ', reaction.reaction.gesture.name)

      // check validity of reaction
      const correctReaction = games[gameId].rules[curLetter] === reaction.reaction.gesture.name
      if (correctReaction && !everyoneReacted) {
        io.of('/games').in(gameId).emit('validated gesture', { gid: player.gid, result: 'correct', gesture: reaction.reaction.gesture.name })
        player.setReactedCorrectly(true)
        player.setTurnCompleted(true)
      } else if (!correctReaction) {
        // declare loser + reset turns
        io.of('/games').in(gameId).emit('validated gesture', { gid: player.gid, result: 'incorrect', gesture: reaction.reaction.gesture.name })
        declareLoser(player, games[gameId], gameId, numberOfCenterCards, io, false, prevTimeout, reaction.reaction.gesture.name)
        checkForWinner(games[gameId], gameId, io)
        return
      }

      // check if everyone except 1 person has (cz he's the loser then)
      const playerCount = games[gameId].players.length
      let reactedCount = 0
      for (player of games[gameId].players) {
        if (player.turnCompleted) reactedCount++
      }
      if (reactedCount === playerCount - 1) everyoneReacted = true

      if (everyoneReacted) {
        // declar loser + reset turns
        player = games[gameId]
          .players
          .find(p => p.turnCompleted === false)
        declareLoser(player, games[gameId], gameId, numberOfCenterCards, io, false, prevTimeout, 'last')
        checkForWinner(games[gameId], gameId, io)
      }

    })

    // Disconnect handlers
    socket.on('disconnecting', () => {
      // fix crash
      if (!users[socket.id]) return

      const { gid, gameId } = users[socket.id]
      const game = games[gameId]

      // temp hack so server doesn't crash on 2 player leaves
      if (game.players.length <= 2) return;

      console.log('gid is', gid, 'and gid', gameId)

      for (s of socket.rooms) {
        if (s !== socket.id) {
          socket.to(s).emit('player left', gid)
        }
      }

      game.removePlayer(gid)
      const turn = game.getCurrentTurn()
      io.of('/games').in(gameId).emit('update turn', { nextTurnGid: game.players[turn].gid })
    })

  })
}

module.exports = setHandlers