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
  currentTurn
  // TODO(): RULES MAP
  // TODO(): WINNERS ARRAY
  // TODO(): CURRENT CARD
  // TODO(): CENTER CARD DECK
  // TODO(): WRONGLY REACTED LIST OF PLAYERS
  rules = {
    'K': 'PewPew',
    'Q': 'peace',
    'J': 'Yolo',
    'A': 'callme',
    'T': 'okay',
  };
  constructor(id) {
    this.id = id
    this.running = false
    this.currentTurn = 0
  }

  addPlayer(player) {
    this.players.push(player)
  }

  setHost(player) {
    this.players.host = player
  }

  startGame() {
    this.running = true
  }

  getCurrentTurn() {
    return this.currentTurn
  }

  isEveryoneReady() {
    return this.players.every(p => p.ready)
  }
<<<<<<< HEAD

  //TODO(): distribute center cards to losers ?

  nextTurn() {
    // TODO(): check if any player has 0 cards
    const n = this.players.length

    this.currentTurn = this.currentTurn + 1 % n
=======

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
>>>>>>> 334f2dd20f97eca838f7f29b5e4bf704cbcfc339
  }
}

module.exports = Game