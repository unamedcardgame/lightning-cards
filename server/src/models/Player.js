class Player {
  gid
  sid
  turn
  cards
  name
  ready
  completedTurn
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

  makeReady() {
    this.ready = true
  }
  makeTurnDone(){
    this.completedTurn=true
  }
  makeTurnUnDone(){
    this.completedTurn=false
  }
}

module.exports = Player