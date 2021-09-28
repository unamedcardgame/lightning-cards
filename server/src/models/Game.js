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
  players = [] // look at Player.js for player details structure
  host
  running
  currentTurn // TODO(): add current turn
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

  startGame() {
    this.running = true
    // set this.currentTurn = someSID
  }

  // TODO(): nextTurn() - changes currentTurn to next player's sid
}

module.exports = Game