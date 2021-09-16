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

  set cards(deck) {
    this.cards.push(...deck)
  }
}

module.exports = Player