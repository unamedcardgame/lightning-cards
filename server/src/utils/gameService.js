const declareLoser = (player, game, gameId, numberOfCenterCards, io, timeup = false) => {
  player.setReactedCorrectly(false)
  loser = player
  loser.addCards(games[gameId].centerCards)
  game.clearCenterDeck()
  // reset turn completed status
  game
    .players
    .forEach(p => p.setTurnCompleted(false))
  io.of('/games').in(gameId).emit('loser declared', { timeup, name: loser.name, sid: loser.sid, cards: numberOfCenterCards })
}

const checkForWinner = (game, gameId, io) => {
  const winner = game.players.find(p => p.cards.length === 0)
  if (winner) {
    io.of('/games').in(gameId).emit('winner declared', { name: winner.name, sid: winner.sid })
  }
}

module.exports = {
  declareLoser,
  checkForWinner
}