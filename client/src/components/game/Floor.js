/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'
import { useState, useEffect, useRef, useContext } from 'react'
import { Container } from 'react-bootstrap'
import { setCallbacks } from '../../services/socketService';
import { AuthContext } from '../../contexts/AuthContext';

const Floor = ({ game, setGame, socket }) => {
  const { userState: authState } = useContext(AuthContext)
  const [drawPile, setDrawPile] = useState([])

  useEffect(() => {
    setCallbacks(socket, setDrawPile)
    console.log(game.cards)
  }, [socket])

  const drawCard = () => {
    console.log(socket.id)
    socket.emit('draw card', { sid: socket.id, gameId: game.id })
  }



  return (
    <Container fluid className="h-100">
      <div className="table">
        {
          game.players
            .map((p, i) => {
              return (
                <div key={i} onClick={drawCard}>
                  <Card back card={'2c'} height={'6em'} />
                  <p style={{ color: 'white' }}>{p}</p>
                </div>
              )
            })
        }
      </div>
      <div className="drawpile">
        <Card card={drawPile} height={'6em'} />
      </div>
    </Container>
  )
}

export default Floor