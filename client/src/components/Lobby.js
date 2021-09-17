import { useEffect } from "react"
import { Button } from 'react-bootstrap'
import { useHistory } from "react-router"
import gameService from "../services/gameService"

const Lobby = ({ socket, game, setGame }) => {
  const history = useHistory()

  useEffect(() => {
    // new player socket handler
    socket.on('new player', (user) => {
      console.log(user.name, 'joined !')
      setGame({ ...game, players: [...game.players, user.name] })
    })

    // on cards ready handler
    socket.on('cards', (cards) => {
      setGame({ ...game, cards: cards.length })
    })

    // on game start socket handler
    socket.on('begin', () => {
      history.push('/floor')
    })
  }, [game, history, setGame, socket])

  const startGame = () => {
    // create cards at the backend
    gameService.getCards(game.id)
    // tell backend to start game via sockets
    socket.emit('start game', { gameId: game.id })
  }

  return (
    <div>
      <ol>
        {game.players.map((p, i) => <li key={i}>{p}</li>)}
      </ol>
      {
        game.host
          ? <Button onClick={startGame}>Begin</Button>
          : null
      }
    </div>
  )
}

export default Lobby