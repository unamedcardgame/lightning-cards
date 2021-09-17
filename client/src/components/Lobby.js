import { useEffect } from "react"
import { Button } from 'react-bootstrap'
import { useHistory } from "react-router"

const Lobby = ({ socket, game, setGame }) => {
  const history = useHistory()

  useEffect(() => {
    socket.on('new player', (user) => {
      console.log(user.name, 'joined !')
      setGame({ ...game, players: [...game.players, user.name] })
    })

    socket.on('begin', () => {
      history.push('/floor')
    })
  }, [game, history, setGame, socket])

  const startGame = () => {
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