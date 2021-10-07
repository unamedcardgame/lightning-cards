/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'
import { useState, useEffect, useRef, useContext } from 'react'
import { Container } from 'react-bootstrap'
import { setCallbacks } from '../../services/socketService';
import { AuthContext } from '../../contexts/AuthContext';
import { useHands } from '../../hooks/useHands';

const Floor = ({ game, gameDispatch, socket }) => {
  const { userState: authState } = useContext(AuthContext)
  const [isCountingDown, setIsCountingDown] = useState(true)
  const [drawPile, setDrawPile] = useState([])
  const hands = useHands(game, gameDispatch, socket)


  useEffect(() => {
    setCallbacks(socket, setDrawPile, gameDispatch)
  }, [])

  useEffect(() => {
    hands.initialiseCanvasAndGE()
  }, [])

  useEffect(() => {
    setInterval(() => setIsCountingDown(false), 3000)
  }, [setIsCountingDown])

  const drawCard = () => {
    //p.userId === authState.userId
    console.log(socket.id)
    // action draw card
    socket.emit('draw card', { sid: socket.id, gameId: game.id })
  }


  return (
    <Container fluid className="h-100">
      <div className="countdown" style={{ display: isCountingDown ? '' : 'none' }}>
        Get Ready !
      </div>
      <div style={{ display: isCountingDown ? 'none' : '' }}>
        <div className="table">
          {
            Object.keys(game.players).map(key => game.players[key])
              .map((p, i) => {
                return (
                  <div key={i} onClick={drawCard}>
                    <Card back height={'6em'} />
                    <p style={{ color: 'white' }}>{p.name} ({p.cards})</p>
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
          <canvas ref={hands.canvasRef} className="output_canvas" width="250px" height="250px"></canvas>
        </div>
      </div>
    </Container>
  )
}

export default Floor