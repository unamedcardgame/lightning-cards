/**
 * @name Game
 */
class Game {
  constructor(id) {
    /** @type {String} uuidv4 */
    this.id = id
    /** @type {boolean} game is running */
    this.running = false
    /** @type {number} ID of player whose turn it is */
    this.currentTurn = 0
    this.players = [] // look at Player.js for player details structure
    this.host
    this.running
    this.currentTurn
    this.centerCards = []
    this.rules = {
      'K': 'pewpew',
      'Q': 'peace',
      'J': 'good morning sir',
      'A': 'rockon',
      'T': 'okay',
    };
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

  removePlayer(socketId) {
    this.players = this.players.filter(p => p.sid !== socketId)
  }
}

module.exports = Game