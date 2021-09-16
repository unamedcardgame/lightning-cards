export const setCallbacks = (socket) => {
  socket.on('cards ready', () => {
  })


  socket.on('card drawn', () => {
    console.log('drew card')
  })
}