export const setCallbacks = (socket) => {
  socket.on('cards ready', () => {
    console.log('yummy cards')
  })

  socket.on('cards', cards => {
    console.log(cards)
  })


  socket.on('card drawn', () => {
    console.log('drew card')
  })
}

/*


*/