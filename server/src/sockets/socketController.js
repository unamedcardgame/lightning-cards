//import {getCurrgetTurn} from "../models/Player";
const Game = require('../models/Game');
const Player = require("../models/Player");



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
        socket.emit('unready', unreadyList)
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

        // notify room that player drew card
        io.of('/games').in(gameId).emit('player drew', sid)

        // TODO(Eric): reaction reception mode ON
        // game.reactionMode = true

        games[gameId].nextTurn()
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


      let curLetter = games[gameId].currentCard?.substring(0, 1)
      const numberOfCenterCards = games[gameId].centerCards.length
      let everyoneReacted = false

      console.log('center react: ', curLetter, 'my react: ', reaction.reaction.gesture.name)

      // check validity of reaction
      const correctReaction = games[gameId].rules[curLetter] === reaction.reaction.gesture.name
      if (correctReaction && !everyoneReacted) {
        socket.emit('validated gesture', { result: 'correct', gesture: reaction.reaction.gesture.name })
        player.setReactedCorrectly(true)
        player.setTurnCompleted(true)
      } else if (!correctReaction) {
        // declar loser + reset turns
        socket.emit('validated gesture', { result: 'incorrect', gesture: reaction.reaction.gesture.name })
        player.setReactedCorrectly(false)
        loser = player
        loser.addCards(games[gameId].centerCards)
        games[gameId].clearCenterDeck()
        // reset turn completed status
        games[gameId]
          .players
          .forEach(p => p.setTurnCompleted(false))
        io.of('/games').in(gameId).emit('loser declared', { sid: loser.sid, cards: numberOfCenterCards })
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
        player.setReactedCorrectly(false)
        loser = player
        loser.addCards(games[gameId].centerCards)
        games[gameId].clearCenterDeck()
        // reset turn completed status
        games[gameId]
          .players
          .forEach(p => p.setTurnCompleted(false))
        io.of('/games').in(gameId).emit('loser declared', { sid: loser.sid, cards: numberOfCenterCards })
      }

    })

    // Debug handlers

  })
}

module.exports = setHandlers