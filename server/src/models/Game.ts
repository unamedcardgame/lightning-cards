import Player from "./Player"
import { Rules } from "./Rules";

export default class Game {
  readonly id;
  currentTurn: number;
  players: Array<Player>
  host: Player;
  centerCards: Array<string>; // TODO(): Make a card type
  readonly rules: Rules;

  constructor(id: string) {
    this.id = id
    this.currentTurn = 0
    this.players = [] // look at Player.js for player details structure
    this.host = {} as Player;
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

  addPlayer(player: Player) {
    this.players.push(player)
  }

  setHost(player: Player) {
    this.host = player;
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
    } while (this.players[this.currentTurn].cards.length === 0)

    return this.currentTurn
  }

  addToCenterDeck(card: string) {
    this.centerCards.push(card)
  }

  clearCenterDeck() {
    this.centerCards = []
  }

  get currentCard() {
    return this.centerCards[this.centerCards.length - 1]
  }

  removePlayer(gid: string) {
    this.players = this.players.filter(p => p.gid !== gid)
  }

  hasPlayer(gid: string) {
    return this.players.some(p => p.gid === gid)
  }
}

module.exports = Game