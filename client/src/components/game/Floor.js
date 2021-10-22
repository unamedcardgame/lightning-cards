/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'
import { useState, useEffect, useRef, useContext } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { Container } from 'react-bootstrap'
import { setCallbacks } from '../../services/socketService';
import { AuthContext } from '../../contexts/AuthContext';
import { useHands } from '../../hooks/useHands';

const SpeechRecognition  = 
    window.speechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()
mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

const Floor = ({ game, gameDispatch, socket }) => {
  const { userState: authState } = useContext(AuthContext)
  const [isCountingDown, setIsCountingDown] = useState(true)
  const [drawPile, setDrawPile] = useState([])
  const hands = useHands(game, gameDispatch, socket)

  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])

  useEffect(() => {
      handleListen()
  }, [isListening])

 const handleListen = () => {
      if (isListening) {
        mic.start()
        mic.onend = () => {
          console.log('continue..')
          mic.start()
        }
      } else {
        mic.stop()
        mic.onend = () => {
          console.log('Mic off')
        }
      }
      mic.onstart = () => {
        console.log('Mic on')
      }

      mic.onresult = event => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
        console.log(transcript)
        setNote(transcript)
        mic.onerror = event => {
          console.log(event.error)
        }
      }
    }
    const handleSaveNote = () => {
      setSavedNotes([...savedNotes, note])
      setNote('')
    }

  useEffect(() => {
    setCallbacks(socket, setDrawPile, gameDispatch)
  }, [])

  useEffect(() => {
    hands.initialiseCanvasAndGE()
  }, [])

  useEffect(() => {
    setInterval(() => setIsCountingDown(false), 3000)
  }, [setIsCountingDown])

  const drawCard = (p) => {
    if(p.sid === socket.id){
      console.log(socket.id)
      // action draw card
      socket.emit('draw card', { sid: socket.id, gameId: game.id })
    }
  }

  return (
    <Container fluid className="h-100">
      <div className="countdown" style={{ display: isCountingDown ? '' : 'none' }}>
        Get Ready !
      </div>
      <div style={{ display: isCountingDown ? 'none' : '' }}>
        <table class="tableCenter">
        <div className="table">
          <tr>
          {
            Object.keys(game.players).map(key => ({...game.players[key],sid: key}))
              .map((p, i) => {
                return (
                  <td>
                  <div style={{margin:"10px"}} key={i} onClick={() => drawCard(p)}>
                    <Card back height={'6em'} />
                    <p style={{ color: 'white', marginTop:'10px'}}>{p.name} ({p.cards})</p>
                  </div>
                  </td>
                )
              })
          }
          </tr>
        </div>
        
        <tr>
          <td>
        <div className="drawpile" style={{marginBottom:"30px"}}>
          <Card card={drawPile} height={'7em'} />
        </div>
        </td>
        </tr>
        </table>
        <table class="tableCenter">
          <tr>
            <td>
        <div className="container">
        <h6 style={{margin:"10px"}}>Record Gesture</h6>
          <video style={{ display: 'none' }} ref={hands.videoRef} className="input_video"></video>
          <canvas ref={hands.canvasRef} className="output_canvas" width="250px" height="250px"></canvas>
        </div>
        </td>
         <td>
        <div className="container">
          <div className="box">
            <h6 style={{margin:"10px"}}>Record Voice</h6>
            {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
            <button class="button-37" onClick={handleSaveNote} disabled={!note} style={{margin:"10px"}}>
              Save it
            </button>
            <button class="button-37" onClick={() => setIsListening(prevState => !prevState)}>
              Start/Stop Recording
            </button>
            <p>{note}</p>
          </div>
          <div className="box">
            <h6>Saved Texts</h6>
            {savedNotes.map(n => (
              <p key={n}>{n}</p>
            ))}
          </div>
        </div>
        </td>
        </tr>
        </table>
      </div>
    </Container>
  )
}

export default Floor