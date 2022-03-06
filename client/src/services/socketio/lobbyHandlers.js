import { addPlayer, removePlayer, setCardLengths } from "../../reducers/gameReducer"

export const setCallbacks = (socket, gameDispatch, setUnreadyList, setUnreadyShow, game, history) => {
  socket.on('new player', (user) => {
    gameDispatch(addPlayer({ gid: user.gid, name: user.name }))
  })

  // on cards ready handler
  socket.on('cards info', (cardsList) => {
    console.log('CI: ', cardsList)
    gameDispatch(setCardLengths(cardsList))
  })

  socket.on('unready', unreadyList => {
    setUnreadyList(unreadyList)
    setUnreadyShow(true)
  })

  socket.on('begin', async () => {
    history.push('/floor')
  })

  socket.on('player left', playerGid => {
    console.log(playerGid, 'left')
    gameDispatch(removePlayer(playerGid))
  })
}