import { updatePlayerCards, setGesture, setReactionReady, setRoundLoser, setReacted, setWinner, setPlayerTurn } from "../../reducers/gameReducer"
import { objectMap } from "../../utils/jsUtils"
import party from 'party-js'

let int

export const setCallbacks = (socket, setDrawPile, gameDispatch, navigate, setIsListening,
  setPlayerResultToggles, setDisplayRoundLoser,
  setTimer, players, setNote) => {

  socket.on('draw pile', ({ card }) => {
    setDrawPile(state => {
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
    gameDispatch(updatePlayerCards(player.gid))
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
      [obj.gid]: true
    })
    )

    if (obj.result === 'correct') {
      party.confetti(document.getElementById(obj.gid), {
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
    if (loser.timeup) gameDispatch(setGesture({ gid: loser.gid, result: 'time up' }))
    setIsListening(false)
    setDrawPile([])
    setTimer(0)
    clearInterval(int)
  })

  socket.on('winner declared', winner => {
    gameDispatch(setWinner(winner))
    navigate('/end')
  })

  socket.on('update turn', player => {
    console.log('yeah got', player.nextTurnGid)
    gameDispatch(setPlayerTurn(player))
  })
}