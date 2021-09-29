class Player {
  gid
  sid
  turn
  cards
  name
  ready
  constructor(gid, sid, name, ready) {
    this.gid = gid
    this.sid = sid
    this.name = name
    this.turn = false
    this.cards = []
    this.ready = ready
  }

  isTurn() {
    return this.turn
  }

  set cards(deck) {
    this.cards.push(...deck)
  }

  makeReady() {
    this.ready = true
  }
}

module.exports = Player