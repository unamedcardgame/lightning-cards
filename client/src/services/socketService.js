import { updatePlayerCards, setGesture, setReactionReady, setRoundLoser, resetGesture, setReacted } from "../reducers/gameReducer"

export const setCallbacks = (socket, setDrawPile, gameDispatch) => {
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
  })

  socket.on('loser declared', (loser) => {
    console.log('looserrrr')
    gameDispatch(setRoundLoser(loser))
    gameDispatch(setReactionReady(false))
    gameDispatch(setReacted(false))
    setDrawPile([])
  })
}