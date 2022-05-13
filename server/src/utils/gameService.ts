import { Server } from "socket.io"
import Games from "../models/Games"
import Game from "../models/Game"
import Player from "../models/Player"

declare var games: Games;

// TODO(): Make a reaction type !
const declareLoser = (player: Player, game: Game, gameId: string, numberOfCenterCards: number, io: Server, timeup = false, prevTimeout: (number | null), reaction: any) => {
  if (prevTimeout) clearInterval(prevTimeout)
  player.setReactedCorrectly(false)
  let loser: Player = player
  loser.addCards(games[gameId].centerCards)
  game.clearCenterDeck()
  // reset turn completed status
  game
    .players
    .forEach(p => p.setTurnCompleted(false))
  io.of('/games').in(gameId).emit('loser declared', { timeup, name: loser.name, gid: loser.gid, cards: numberOfCenterCards, reaction })
}

const checkForWinner = (game: Game, gameId: string, io: Server) => {
  const winner = game.players.find(p => p.cards.length === 0)
  if (winner) {
    io.of('/games').in(gameId).emit('winner declared', { name: winner.name, gid: winner.gid })
  }
}

export {
  declareLoser,
  checkForWinner
}
