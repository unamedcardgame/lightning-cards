class Player {
  gid
  sid
  turn
  cards
  name
  ready
  reactedCorrectly
  turnCompleted = false

  constructor(gid, sid, name, ready) {
    this.gid = gid
    this.sid = sid
    this.name = name
    this.turn = false
    this.cards = []
    this.ready = ready
    this.completedTurn = false
  }

  isTurn() {
    return this.turn
  }

  set cards(deck) {
    this.cards.push(...deck)
  }

  addCards(cards) {
    this.cards.push(...cards)
  }

  makeReady() {
    this.ready = true
  }

  setTurnCompleted(completed) {
    this.turnCompleted = completed
  }

  setReactedCorrectly(correct) {
    this.reactedCorrectly = correct
  }
}

module.exports = Player