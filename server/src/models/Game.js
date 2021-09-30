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
  currentTurn =0// TODO(): add current turn
  constructor(id) {
    this.id = id
    this.running = false
  }

  addPlayer(player) {
    this.players.push(player)
    this.currentTurn=0
  }

  setHost(player) {
    this.players.host = player
  }

  startGame() {
    this.running = true
    this.currentTurn = 0
  }

  getCurrentTurn() {
    return this.currentTurn
  }

  isEveryoneReady() {
    return this.players.every(p => p.ready)
  }
  
  // TODO(): nextTurn() - changes currentTurn to next player's sid
  nextTurn()
  {
    let n = this.players.length-1
    //console.log("n="+ n)
    if(this.currentTurn<n)
    {
      this.currentTurn+=1

    }
    else
    {
      this.currentTurn=0
    }
  }
}

module.exports = Game