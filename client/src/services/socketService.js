import { updatePlayerCards, setGesture, setReactionReady, setRoundLoser, setReacted, setWinner } from "../reducers/gameReducer"

export const setCallbacks = (socket, setDrawPile, gameDispatch, history, setIsListening, playerResultToggles, setPlayerResultToggles) => {
  socket.on('cards ready', () => {
    console.log('yummy cards')
  })

  socket.on('draw pile', ({ card }) => {
    setDrawPile(card)
  })

  socket.on('player drew', player => {
    gameDispatch(updatePlayerCards(player))
    gameDispatch(setReactionReady(true))
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
    gameDispatch(setReactionReady(false))
    gameDispatch(setReacted(false))
    setIsListening(false)
    setDrawPile(undefined)
  })

  socket.on('winner declared', winner => {
    // TODO(): Transition to winner screen
    gameDispatch(setWinner(winner))
    history.push('/end')
  })
}