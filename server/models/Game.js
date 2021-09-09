/* {
      id: gameIdGen,
      players: {
        [user.id]: { turn: false }
      }
    })
    idToGame[user.id] = gameIdGen++
  }

 */

class Game {
  id
  players = []
  constructor(id, host) {
    this.id = id
    this.players.push(host)
  }

  addPlayer(player) {
    this.players.push(player)
  }
}

module.exports = Game