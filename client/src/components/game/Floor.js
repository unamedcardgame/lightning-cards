/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'
import { useState, useEffect, useRef, useContext } from 'react'
import { Container } from 'react-bootstrap'
import { setCallbacks } from '../../services/socketService';
import { AuthContext } from '../../contexts/AuthContext';
import { useHands } from '../../hooks/useHands';

const Floor = ({ game, setGame, socket }) => {
  const { userState: authState } = useContext(AuthContext)
  const [drawPile, setDrawPile] = useState([])
  const hands = useHands()


  useEffect(() => {
    setCallbacks(socket, setDrawPile)
    console.log(game.cards)
  }, [socket])

  useEffect(() => {
    hands.initialiseCanvasAndGE()
  }, [])

  const drawCard = () => {
    //p.userId === authState.userId
    console.log(socket.id)
    // action draw card
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
                  <Card back height={'6em'} />
                  <p style={{ color: 'white' }}>{p}</p>
                </div>
              )
            })
        }
      </div>
      <div className="drawpile">
        <Card card={drawPile} height={'6em'} />
      </div>
      <div className="container">
        <video style={{ display: 'none' }} ref={hands.videoRef} className="input_video"></video>
        <canvas ref={hands.canvasRef} className="output_canvas" width="1280px" height="720px"></canvas>
      </div>
    </Container>
  )
}

export default Floor