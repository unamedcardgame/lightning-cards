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
    'K': 'pewpew',
    'Q': 'peace',
    'J': 'good morning sir',
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

  // TODO(): nextTurn() - changes currentTurn to next player's sid
  nextTurn() {
    const n = this.players.length

    do {
      this.currentTurn = (this.currentTurn + 1) % n
    } while (this.players[this.currentTurn].cards === 0)

    return this.currentTurn
  }

  addToCenterDeck(card) {
    this.centerCards.push(card)
  }

  clearCenterDeck() {
    this.centerCards = []
  }

  get currentCard() {
    return this.centerCards[this.centerCards.length - 1]
  }

  getresult() {

  }
}

module.exports = Game