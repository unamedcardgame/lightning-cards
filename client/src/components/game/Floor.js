/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Popup from '../overlay/Popup'
import { Button } from 'react-bootstrap'
import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'
import { useState, useEffect, Fragment, useRef } from 'react'
import gameService from "../../services/gameService"
import { Container } from 'react-bootstrap'
import { setCallbacks } from '../../services/socketService';
import { useHands } from '../../hooks/useHands';
import { useHistory } from 'react-router'
import { objectMap } from '../../utils/jsUtils'
import SweetAlert from 'react-bootstrap-sweetalert'
import party from 'party-js'

const SpeechRecognition =
  window.speechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()
mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

const Floor = ({ game, gameDispatch, socket }) => {
  const history = useHistory()
  const [isCountingDown, setIsCountingDown] = useState(true)
  const [ignoredOne, setIgnoredOne] = useState(false)
  const [playerResultToggles, setPlayerResultToggles] = useState(
    objectMap(game.players, () => false)
  )
  const playerCardsRef = useRef()
  const [displayRoundLoser, setDisplayRoundLoser] = useState(false)
  const [drawPile, setDrawPile] = useState([])
  const hands = useHands(game, gameDispatch, socket, ignoredOne, setIgnoredOne)
  const [modalShow, setModalShow] = useState(false)

  const [timer, setTimer] = useState(null)

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
    else if (note !== '') {
      socket.emit('gesture', {
        reaction: {
          gesture: { name: note },
          timestamp: new Date().getTime()
        },
        gameId: game.id
      })
      setIsListening(false)
    } else {
      setIsListening(false)
    }
  }

  console.log('fml')

  useEffect(() => {
    setCallbacks(socket, setDrawPile, gameDispatch, history, setIsListening,
      playerResultToggles, setPlayerResultToggles, setDisplayRoundLoser, setTimer, game.players, party)
  }, [])

  useEffect(() => {
    hands.initialiseCanvasAndGE()
  }, [])

  useEffect(() => {
    setInterval(() => setIsCountingDown(false), 0) // TODO(): Set back to 3000
  }, [setIsCountingDown])

  const drawCard = (p) => {
    console.log(game.rules)
    if (drawPile.length === 0 || (p.sid === socket.id && ['K', 'Q', 'A', 'J', 'T'].every(c => drawPile[drawPile.length - 1][0] !== c))) {
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
      <div className="div-right">
        <video style={{ display: 'none' }} ref={hands.videoRef} className="input_video" crossOrigin="anonymous" playsInline="true"></video>
        <canvas ref={hands.canvasRef} className="output_canvas" width="360" height="250px"></canvas>
        <div className="container">
          <div className="box" style={{ fontSize: "30px" }} >
            {!isListening ? <span> 🎙️ </span> : <span> 🛑🎙️ </span>}
            <Button className="button-35" onClick={toggleVoiceReaction}>
              Record Voice Reaction
            </Button>
            <p style={{ fontSize: "20px" }}>{note}</p>
          </div>
          {/*<div className="box">
            <h6>Saved Texts</h6>
            {savedNotes.map(n => (
              <p key={n}>{n}</p>
            ))}
          </div> */}
        </div>
      </div>
      <div className="div-left">
        <div >
          <Button className="button-35" style={{ marginTop: 10 }} variant="primary" onClick={() => setModalShow(true)}> Rules</Button>
          <Popup text={Object.entries(game.rules).map((r, i) => (<div key={i}>{r[0]}: {r[1]}</div>))}
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
        </div>
        <div style={{ marginTop: "10px", fontSize: "30px", float: "left" }}> ⏱️ {timer !== 0 ? timer : ''}</div>
      </div>
      <div style={{ display: isCountingDown ? 'none' : '' }}>
        <table className="tableCenter"  >
          <tbody>
            <tr>
              {
                Object.keys(game.players).map(key => ({ ...game.players[key], sid: key }))
                  .map((p, i) => {
                    return (
                      <td>
                        <div id={p.sid} className={p.turn ? 'player player-turn' : 'player'} style={{ margin: "30px", textAlign: 'center' }} key={i} onClick={() => drawCard(p)}>
                          <Card back height={'8em'} style={{margin: 'auto'}} />
                            <span style={{ display: 'inline-block', margin: '0.5em 0.7em 0 0.5em' }}>{p.name} ({p.cards})</span>
                          <span style={{ display: playerResultToggles[p.sid] ? '' : '' }} class="reaction">{p.reaction?.result
                            === 'correct' ? '✅' : '❌'}</span>
                        </div>
                      </td>
                    )
                  })
              }
            </tr>
          </tbody>
        </table>
        {/* </div> */}
        <table className="tableCenter" width="30%" >
          <tbody>
            <tr>
              <td>
                <div className="drawpile" style={{ height: '8em', width: '10em', marginBottom: "30px", marginTop: "30px", margin: "30px" }}>
                  {drawPile.length !== 0
                    ? drawPile
                      .map((c, i) => {
                        const transf = i * 8
                        console.log('tr', transf)
                        return (
                          <div key={c} className="center-card" style={{
                            position: 'absolute',
                            transform: 'translateX(' + transf + 'px)'
                          }}>
                            <Card card={c} height={'8em'} />
                          </div>)
                      })
                    : ''
                  }
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="container">
                  <h6 style={{ margin: "10px" }}>{game.reactionReady ? 'MAKE YOUR REACTION ! ' : 'Wait for Draw... '}  </h6>
                  <div className="debug">
                    Debug
                    <br />
                    <span>You reacted: {game.players[socket.id].reaction?.gesture} </span>
                    <br />
                  </div>
                </div>
                <SweetAlert
                  show={displayRoundLoser}
                  danger
                  title={game.roundLoser.name}
                  timeout={1100}
                  onConfirm={() => { }}
                  customButtons={<Fragment>
                  </Fragment>}
                  style={{ color: 'black' }}
                >
                  {game.roundLoser.name} Reacted <strong><em>{game.roundLoser.reaction}</em></strong><br/> Better Luck Next Time!
                </SweetAlert>
                {/* </td><td> */}
              </td>
            </tr>
          </tbody>
        </table>
        <table className="tableCenter">
          <tbody>

          </tbody>
        </table>
      </div>
    </Container >
  )
}

export default Floor