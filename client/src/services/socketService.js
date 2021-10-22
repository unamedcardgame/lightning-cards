import { updatePlayerCards, setGesture } from "../reducers/gameReducer"

export const setCallbacks = (socket, setDrawPile, gameDispatch) => {
  socket.on('cards ready', () => {
    console.log('yummy cards')
  })

  socket.on('draw pile', ({ card }) => {
    setDrawPile(card)
  })

  socket.on('player drew', player => {
    gameDispatch(updatePlayerCards(player))
  })

  socket.on('validated gesture', obj => {
    gameDispatch(setGesture(obj))
  })
}