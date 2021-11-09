/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'
import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { setCallbacks } from '../../services/socketService';
import { useHands } from '../../hooks/useHands';
import { useHistory } from 'react-router'

const SpeechRecognition =
  window.speechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()
mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

const Floor = ({ game, gameDispatch, socket }) => {
  const history = useHistory()
  const [isCountingDown, setIsCountingDown] = useState(true)
  const [drawPile, setDrawPile] = useState(undefined)
  const hands = useHands(game, gameDispatch, socket)

  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)

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

  const toggleVoiceReaction = () => {
    if (!isListening && game.reactionReady) setIsListening(true)
    else {
      // TODO(): send reaction to backend
      setIsListening(false)
      socket.emit('gesture', {
        reaction: {
          gesture: { name: note },
          timestamp: new Date().getTime()
        },
        gameId: game.id
      })
    }
  }

  useEffect(() => {
    setCallbacks(socket, setDrawPile, gameDispatch, history, setIsListening)
  }, [])

  useEffect(() => {
    hands.initialiseCanvasAndGE()
  }, [])

  useEffect(() => {
    setInterval(() => setIsCountingDown(false), 0) // TODO(): Set back to 3000
  }, [setIsCountingDown])

  const drawCard = (p) => {
    console.log(drawPile)
    if (drawPile === undefined || (p.sid === socket.id && ['K', 'Q', 'A', 'J', 'T'].every(c => drawPile[0] !== c))) {
      setNote('')
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
        <table className="tableCenter">
        <tbody>
          {/* <div className="table"> */}
            <tr>
              {
                Object.keys(game.players).map(key => ({ ...game.players[key], sid: key }))
                  .map((p, i) => {
                    return (
                      <td>
                        <div style={{ margin: "10px" }} key={i} onClick={() => drawCard(p)}>
                          <Card back height={'6em'} />
                          <p style={{ color: 'white', marginTop: '10px' }}>{p.name} ({p.cards})</p>
                        </div>
                      </td>
                    )
                  })
              }
            </tr>
          {/* </div> */}

          <tr>
            <td>
              <div className="drawpile" style={{ marginBottom: "30px" }}>
                {drawPile
                  ? <Card card={drawPile} height={'7em'} />
                  : ''
                }
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <table className="tableCenter">
        <tbody>
          <tr>
            <td>
              <div className="container">
                <h6 style={{ margin: "10px" }}>{game.reactionReady ? 'MAKE YOUR REACTION ! ' : 'Wait for Draw... '}  </h6>
                <h6>Your reaction: {game.reaction?.gesture}</h6>
                <h6>Your result: {game.reaction?.result}</h6>
                <h5>{game.roundLoser ? 'Round loser: ' + game.roundLoser : ''}</h5>
                <video style={{ display: 'none' }} ref={hands.videoRef} className="input_video" crossOrigin="anonymous" playsInline="true"></video>
                <canvas ref={hands.canvasRef} className="output_canvas" width="480px" height="320px"></canvas>
              </div>
              <div className="container">
                <div className="box">
<<<<<<< HEAD
                  <h6 style={{ margin: "10px" }}>Record Voice</h6>
                  {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
                  <button className="button-37" onClick={handleSaveNote} disabled={!note} style={{ margin: "10px" }}>
                    Clear
                  </button>
                  <button className="button-37" onClick={() => setIsListening(prevState => !prevState)}>
                    Mic On/Off
=======
                  {!isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
                  <button class="button-37" onClick={toggleVoiceReaction}>
                    Record voice reaction
>>>>>>> ca0d19feb2be08136059bc0d995ca20a04916af3
                  </button>
                  <p>{note}</p>
                </div>
                {/*<div className="box">
                  <h6>Saved Texts</h6>
                  {savedNotes.map(n => (
                    <p key={n}>{n}</p>
                  ))}
                </div> */}
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </Container>
  )
}

export default Floor