class Game {
  constructor(id) {
    this.id = id
    this.running = false
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

  removePlayer(gid) {
    this.players = this.players.filter(p => p.gid !== gid)
  }

  hasPlayer(gid) {
    return this.players.some(p => p.gid === gid)
  }
}

module.exports = Game