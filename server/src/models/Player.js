class Player {
  gid
  sid
  turn
  cards
  name
  constructor(gid, sid, name) {
    this.gid = gid
    this.sid = sid
    this.name = name
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