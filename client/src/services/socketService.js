import { updatePlayerCards } from "../reducers/gameReducer"

export const setCallbacks = (socket, setDrawPile, gameDispatch) => {
  socket.on('cards ready', () => {
    console.log('yummy cards')
  })

  socket.on('draw pile', ({ card }) => {
    console.log('drew card')
    setDrawPile(card)
  })

  socket.on('player drew', player => {
    console.log('PLAYA', player)
    gameDispatch(updatePlayerCards(player))
  })
}