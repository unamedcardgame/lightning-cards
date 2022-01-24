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
    this.turn = false
    this.cards = []
    this.name = name
    this.ready = ready
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