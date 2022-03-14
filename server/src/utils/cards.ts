// knuth shuffle
function shuffleArray(array: Array<string>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// create an array of cards
//clubs (♣), diamonds (♦), hearts (♥), and spades (♠)

let cards: Array<string> = ["4d", "3c", "Ah", "2s", "Ac", "Tc", "6h", "Qh", "6s", "As", "Ks", "3h", "6c", "7c", "4c", "9d", "5c",
  "9h", "2d", "5s", "7d", "Ad", "Kc", "Qc", "4s", "Jh", "5h", "Jd", "5d", "8s", "3d", "Qd", "3s", "Kh", "7s", "6d", "7h",
  "9s", "8h", "8d", "Kd", "Ts", "8c", "Th", "2h", "9c", "Jc", "4h", "2c", "Js", "Td", "Qs"]

export default function generateCards(numOfPlayers: number): Array<Array<string>> {
  shuffleArray(cards)
  let playerCards: Array<Array<string>> = []
  const cardsPerPlayer: number = (12 / numOfPlayers) | 0

  for (let i = 0; i < numOfPlayers; i++) {
    const start = i * cardsPerPlayer
    playerCards.push(cards.slice(start, cardsPerPlayer + start))
  }

  //playerCards[numOfPlayers - 1].push(...cards.slice(numOfPlayers * cardsPerPlayer))
  return playerCards
}