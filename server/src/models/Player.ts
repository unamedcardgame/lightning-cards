export default class Player {
  readonly gid: string
  readonly turn
  cards: Array<string>
  name
  ready
  reactedCorrectly: boolean
  turnCompleted: boolean

  constructor(gid: string, name: string, ready: boolean) {
    this.gid = gid
    this.turn = false
    this.cards = []
    this.name = name
    this.ready = ready
    this.reactedCorrectly = false
    this.turnCompleted = false
  }

  isTurn() {
    return this.turn
  }

  setCards(deck: string) {
    this.cards.push(...deck)
  }

  addCards(cards: Array<string>) {
    this.cards.push(...cards)
  }

  makeReady() {
    this.ready = true
  }

  setTurnCompleted(completed: boolean) {
    this.turnCompleted = completed
  }

  setReactedCorrectly(correct: boolean) {
    this.reactedCorrectly = correct
  }
}

module.exports = Player