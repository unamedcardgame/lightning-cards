import { updatePlayerCards, setGesture, setReactionReady, setRoundLoser, setReacted, setWinner, setPlayerTurn } from "../reducers/gameReducer"

export const setCallbacks = (socket, setDrawPile, gameDispatch, history, setIsListening,
  playerResultToggles, setPlayerResultToggles, setDisplayRoundLoser,
  setTimer) => {
  socket.on('cards ready', () => {
    console.log('yummy cards')
  })

  socket.on('draw pile', ({ card }) => {
    setDrawPile(card)
    // set timer
    console.log(card[0])
    if (['T', 'K', 'A', 'Q', 'J'].includes(card[0])) {
      let i = 7 // ROUND TIMEOUT
      let int = setInterval((setTimer) => {
        setTimer(i);
        i-- || clearInterval(int);  //if i is 0, then stop the interval
      }, 1000, setTimer);
    }
  })

  socket.on('player drew', player => {
    gameDispatch(updatePlayerCards(player.sid))
    gameDispatch(setReactionReady(true))
    gameDispatch(setPlayerTurn(player))
  })

  socket.on('validated gesture', obj => {
    gameDispatch(setGesture(obj))
    setPlayerResultToggles(
      {
        ...playerResultToggles,
        [obj.sid]: true
      }
    )
    setTimeout(() => {
      setPlayerResultToggles(
        {
          ...playerResultToggles,
          [obj.sid]: false
        }
      )
    }, 2000)
  })

  socket.on('loser declared', (loser) => {
    console.log('looserrrr')
    gameDispatch(setRoundLoser(loser))
    setDisplayRoundLoser(true)
    setTimeout(() => setDisplayRoundLoser(false), 3000)
    gameDispatch(setReactionReady(false))
    gameDispatch(setReacted(false))
    if (loser.timeup) gameDispatch(setGesture({ sid: loser.sid, result: 'time up' }))
    setPlayerResultToggles(
      {
        ...playerResultToggles,
        [loser.sid]: true
      }
    )
    setTimeout(() => {
      setPlayerResultToggles(
        {
          ...playerResultToggles,
          [loser.sid]: false
        }
      )
    }, 2000)
    setIsListening(false)
    setDrawPile(undefined)
  })

  socket.on('winner declared', winner => {
    // TODO(): Transition to winner screen
    gameDispatch(setWinner(winner))
    history.push('/end')
  })
}