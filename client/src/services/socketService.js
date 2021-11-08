import { updatePlayerCards, setGesture, setReactionReady } from "../reducers/gameReducer"

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

  socket.on('loser declared', () => {
    gameDispatch(setReactionReady(false))
  })
}