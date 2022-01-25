import { addPlayer, removePlayer, setCardLengths, setRules } from "../../reducers/gameReducer"
import gameService from "../gameService"

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
    //hands.closeHands()
    const { rules } = await gameService.getRules(game.id)
    gameDispatch(setRules(rules))
    history.push('/floor')
  })

  socket.on('player left', playerGid => {
    console.log(playerGid, 'left')
    gameDispatch(removePlayer(playerGid))
  })
}