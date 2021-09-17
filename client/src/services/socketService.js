export const setCallbacks = (socket, setDrawPile) => {
  socket.on('cards ready', () => {
    console.log('yummy cards')
  })

  socket.on('cards', cards => {
    console.log(cards)
  })


  socket.on('draw pile', ({card}) => {
    console.log('drew card')
    setDrawPile(card)
  })
}

/*


*/