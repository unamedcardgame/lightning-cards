class Player {
  gid
  sid
  turn
  cards
  constructor(gid, sid) {
    this.gid = gid
    this.sid = sid
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