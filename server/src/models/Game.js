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
  host
  constructor(id) {
    this.id = id
    this.running = false
  }

  addPlayer(player) {
    this.players.push(player)
  }

  setHost(player) {
    this.players.host = player
  }

  get isRunning() {
    return this.running
  }

  startGame() {
    this.running = true
  }
}

module.exports = Game