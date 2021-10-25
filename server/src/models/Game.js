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
  centerCards = []
  // TODO(): WINNERS ARRAY
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
  isEveryonesTurnDone()
  {
    return this.players.every(p =>p.completedTurn)
  }

  // TODO(): nextTurn() - changes currentTurn to next player's sid
  nextTurn() {
    let n = this.players.length - 1
    console.log(n)
    if (this.currentTurn < n) {
      this.currentTurn += 1
    }
    else {
      this.currentTurn = 0
    }
  }

  addToCenterDeck(card) {
    this.centerCards.push(card)
  }

  get currentCard() {
    console.log('CENTER CARD', this.centerCards)
    return this.centerCards[this.centerCards.length - 1]
  }

  getresult(){
    
  }
}

module.exports = Game