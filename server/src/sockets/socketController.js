const Game = require('../models/Game');
const Player = require("../models/Player");
const { declareLoser, checkForWinner } = require('../utils/gameService')

let prevTimeout = undefined

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
    })

    // Game handlers
    socket.on('start game', (game) => {
      if (!games[game.gameId].isEveryoneReady()) {
        const unreadyList = games[game.gameId].players.filter(p => p.ready === false)
        socket.emit('unready', unreadyList.map(p => p.name))
        return
      }
      games[game.gameId].startGame()

      io.of('/games').in(game.gameId).emit('begin')
    })

    socket.on('draw card', user => {
      const { sid, gameId } = user
      let currentvalue = games[gameId].getCurrentTurn()

      // get sid's top card
      // validate whether sid === current player's turn ka sid
      // games[gameId].currentTurn === sid
      if (sid === games[gameId].players[currentvalue].sid) {
        // get sid's top card
        const card = games[gameId].players
          .find(p => p.sid === sid)
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
          prevTimeout = setTimeout(() => {
            console.log('to')
            const loser = games[gameId]
              .players
              .find(p => p.turnCompleted === false)

            if (loser) {
              declareLoser(loser, games[gameId], gameId, games[gameId].centerCards.length, io, true)
            }
          }, 5000)
        }

        // notify room that player drew card
        const turn = games[gameId].nextTurn()
        io.of('/games').in(gameId).emit('player drew', { sid, nextTurnSid: games[gameId].players[turn].sid })

        // TODO(Eric): reaction reception mode ON
        // game.reactionMode = true

      }
      else {
        // TODO(): Send to frontend to display not your turn or something ?
      }


    })

    socket.on('gesture', reaction => {
      const { gameId } = reaction
      let player = games[gameId]
        .players
        .find(p => p.sid === socket.id)
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
        io.of('/games').in(gameId).emit('validated gesture', { sid: socket.id, result: 'correct', gesture: reaction.reaction.gesture.name })
        player.setReactedCorrectly(true)
        player.setTurnCompleted(true)
      } else if (!correctReaction) {
        // declare loser + reset turns
        io.of('/games').in(gameId).emit('validated gesture', { sid: socket.id, result: 'incorrect', gesture: reaction.reaction.gesture.name })
        declareLoser(player, games[gameId], gameId, numberOfCenterCards, io, false, prevTimeout)
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
        declareLoser(player, games[gameId], gameId, numberOfCenterCards, io, false, prevTimeout)
        checkForWinner(games[gameId], gameId, io)
      }

    })

    // Debug handlers

  })
}

module.exports = setHandlers