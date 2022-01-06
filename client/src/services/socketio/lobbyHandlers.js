import { addPlayer, removePlayer, setCardLengths, setRules } from "../../reducers/gameReducer"
import gameService from "../gameService"

export const setCallbacks = (socket, gameDispatch, setUnreadyList, setUnreadyShow, hands, game, history) => {
  socket.on('new player', (user) => {
    gameDispatch(addPlayer({ id: user.id, name: user.name, sid: user.sid, }))
  })

  // on cards ready handler
  socket.on('cards info', (cardsList) => {
    gameDispatch(setCardLengths(cardsList))
  })

  socket.on('unready', unreadyList => {
    setUnreadyList(unreadyList)
    setUnreadyShow(true)
  })

  socket.on('begin', async () => {
    hands.closeHands()
    const { rules } = await gameService.getRules(game.id)
    gameDispatch(setRules(rules))
    history.push('/floor')
  })

  socket.on('player left', playerSid => {
    console.log('ciaooo', playerSid)
    gameDispatch(removePlayer(playerSid))
  })

  socket.on('disconnect', reason => {
    socket.emit('lefting', game.id)
  })
}