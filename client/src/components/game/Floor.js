/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'
import { useState, useEffect, useRef, useContext } from 'react'
import { Container } from 'react-bootstrap'
import { setCallbacks } from '../../services/socketService';
import { AuthContext } from '../../contexts/AuthContext';
import { Hands } from '@mediapipe/hands'
import { Camera } from '@mediapipe/camera_utils'
import { drawLandmarks } from '@mediapipe/drawing_utils'
import { GestureEstimator } from 'fingerpose'
import { gestures } from '../../services/fingerpose/fingerposeService'

const Floor = ({ game, setGame, socket }) => {
  const { userState: authState } = useContext(AuthContext)
  const [drawPile, setDrawPile] = useState([])
  const [ctx, setCtx] = useState(null)
  const [GE, setGE] = useState(null)

  const videoRef = useRef()
  const canvasRef = useRef()

  useEffect(() => {
    setCallbacks(socket, setDrawPile)
    console.log(game.cards)
  }, [socket])

  const drawCard = () => {
    //p.userId === authState.userId
    console.log(socket.id)
    // action draw card
    socket.emit('draw card', { sid: socket.id, gameId: game.id })
  }

  const onResults = (results) => {
    ctx.save();
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(
      results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 2 });

        // conv landmarks for fp
        for (let f in landmarks) {
          landmarks[f] = Object.values(landmarks[f]).map((e, i) => i < 3 ? e * 1000 : null)
        }

        const estimatedGestures = GE.estimate(landmarks, 7.5);
        console.log(estimatedGestures.gestures[0])
      }
    }
    ctx.restore();
  }

  // create a canvas and initialise gesture estimators
  useEffect(() => {
    setCtx(canvasRef.current.getContext('2d'))
    setGE(new GestureEstimator(
      gestures
    ))
  }, [])


  // initialise mediapipe
  useEffect(() => {
    if (ctx) {
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });
      hands.setOptions({
        maxNumHands: 1,
        minDetectionConfidence: 0.8,
        minTrackingConfidence: 0.5
      });
      hands.onResults(onResults);

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 1280,
        height: 720
      });
      camera.start();
    }
  }, [ctx])


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
        <video style={{ display: 'none' }} ref={videoRef} className="input_video"></video>
        <canvas ref={canvasRef} className="output_canvas" width="1280px" height="720px"></canvas>
      </div>
    </Container>
  )
}

export default Floor