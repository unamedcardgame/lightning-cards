import { useEffect } from "react"
import { Button } from 'react-bootstrap'
import { useHistory } from "react-router"
import Popup from "./overlay/PopupWindow";
import React, { useState } from 'react';




const Lobby = ({ socket, game, setGame }) => {
  const [modalShow, setModalShow] = useState(false);
  const history = useHistory()

  useEffect(() => {
    socket.on('new player', (user) => {
      console.log(user.name, 'joined !')
      
      setModalShow(true)
      
      

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
        Players List
        {game.players.map((p, i) => <li key={i}>{p}</li>)}
        
      </ol>
      {
        game.host
          ? <div><ol><Button onClick={startGame}>Begin</Button></ol> 
          <ol><Button variant="primary" onClick={() => setModalShow(true)}>
          Game Id
        </Button>
      <Popup Text={game.id}
    show={modalShow}
    onHide={() => setModalShow(false)}
  /></ol>
        </div>
          
          : null
      }
      
    </div>
  )
}

export default Lobby