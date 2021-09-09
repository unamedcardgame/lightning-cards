class Player {
  id
  turn
  cards
  constructor(id) {
    this.id = id
    this.turn = false
    this.cards = []
  }

  isTurn() {
    return this.turn
  }
}

module.exports = Player