import { updatePlayerCards, setGesture, setReactionReady, setRoundLoser, setReacted, setWinner, setPlayerTurn } from "../reducers/gameReducer"
import { objectMap } from "../utils/jsUtils"

let int

export const setCallbacks = (socket, setDrawPile, gameDispatch, history, setIsListening,
  playerResultToggles, setPlayerResultToggles, setDisplayRoundLoser,
  setTimer, players, party, setNote) => {
  socket.on('cards ready', () => {
    console.log('yummy cards')
  })

  socket.on('draw pile', ({ card }) => {
    setDrawPile(state => {
      console.log([...state, card])
      return [...state, card]
    })
    // set timer
    if (['T', 'K', 'A', 'Q', 'J'].includes(card[0])) {
      let i = 7 // ROUND TIMEOUT
      int = setInterval((setTimer) => {
        setTimer(i);
        i-- || clearInterval(int);  //if i is 0, then stop the interval
      }, 1000, setTimer);
    }
  })

  socket.on('player drew', player => {
    gameDispatch(updatePlayerCards(player.sid))
    gameDispatch(setReactionReady(true))
    gameDispatch(setPlayerTurn(player))
    setNote('')

    setPlayerResultToggles(
      objectMap(players, () => false)
    )
  })

  socket.on('validated gesture', obj => {
    gameDispatch(setGesture(obj))
    setPlayerResultToggles((state) =>
    ({
      ...state,
      [obj.sid]: true
    })
    )

    if (obj.result === 'correct') {
      party.confetti(document.getElementById(obj.sid), {
        count: party.variation.range(10, 50),
        size: party.variation.range(0.4, 1),
      })
    }
  })

  socket.on('loser declared', (loser) => {
    console.log('looserrrr')
    gameDispatch(setRoundLoser(loser))
    setDisplayRoundLoser(true)
    setTimeout(() => setDisplayRoundLoser(false), 3000)
    gameDispatch(setReactionReady(false))
    gameDispatch(setReacted(false))
    if (loser.timeup) gameDispatch(setGesture({ sid: loser.sid, result: 'time up' }))
    setIsListening(false)
    setDrawPile([])
    setTimer(0)
    clearInterval(int)
  })

  socket.on('winner declared', winner => {
    // TODO(): Transition to winner screen
    gameDispatch(setWinner(winner))
    history.push('/end')
  })
}