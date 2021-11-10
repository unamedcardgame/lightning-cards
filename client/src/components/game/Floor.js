/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Popup from '../overlay/Popup'
import { Button } from 'react-bootstrap'
import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'
import { useState, useEffect } from 'react'
import gameService from "../../services/gameService"
import { Container } from 'react-bootstrap'
import { setCallbacks } from '../../services/socketService';
import { useHands } from '../../hooks/useHands';
import { useHistory } from 'react-router'
import { cloneDeep } from 'lodash';

// map for objects
const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )

const SpeechRecognition =
  window.speechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()
mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

const Floor = ({ game, gameDispatch, socket }) => {
  const history = useHistory()
  const [isCountingDown, setIsCountingDown] = useState(true)
  const [playerResultToggles, setPlayerResultToggles] = useState(
    objectMap(game.players, () => false)
  )
  const [displayRoundLoser, setDisplayRoundLoser] = useState(false)
  const [drawPile, setDrawPile] = useState(undefined)
  const hands = useHands(game, gameDispatch, socket)
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

  useEffect(() => {
    setCallbacks(socket, setDrawPile, gameDispatch, history, setIsListening,
      playerResultToggles, setPlayerResultToggles, setDisplayRoundLoser, setTimer)
  }, [])

  useEffect(() => {
    hands.initialiseCanvasAndGE()
  }, [])

  useEffect(() => {
    setInterval(() => setIsCountingDown(false), 0) // TODO(): Set back to 3000
  }, [setIsCountingDown])

  const drawCard = (p) => {
    console.log(game.rules)
    console.log(drawPile)
    if (drawPile === undefined || (p.sid === socket.id && ['K', 'Q', 'A', 'J', 'T'].every(c => drawPile[0] !== c))) {
      setNote('')
      // action draw card
      socket.emit('draw card', { sid: socket.id, gameId: game.id })

    }
  }

  return (
    <Container fluid className="h-100">
      <div className="countdown"  style={{ display: isCountingDown ? '' : 'none' }}>
        Get Ready !
      </div>
      <div className="div-right">
          <video style={{ display: 'none' }} ref={hands.videoRef} className="input_video" crossOrigin="anonymous" playsInline="true"></video>
          <canvas ref={hands.canvasRef} className="output_canvas" width="360" height="250px"></canvas>
          <div className="container">
            <div className="box" >
              {!isListening ? <span> 🎙️ </span> : <span> 🛑🎙️ </span>}
              <button className="button-37" onClick={toggleVoiceReaction}>
                Record Voice Reaction
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
      </div>
      <div className="div-left">
            <div >
                  <Button className="button-35" style={{ marginTop:10 }} variant="primary" onClick={() => setModalShow(true)}> Rules</Button>
                  <Popup text={Object.entries(game.rules).map((r, i) => (<div key={i}>{r[0]}: {r[1]}</div>))}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                  />
            </div>
            <div style={{marginTop: "10px", fontSize: "30px", float: "left"}}> ⏱️ : {timer !== 0 ? timer : ''}</div>
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
                        <div className={p.turn ? 'player player-turn' : 'player'} style={{ margin: "30px" }} key={i} onClick={() => drawCard(p)}>
                          <div style={{ display: playerResultToggles[p.sid] ? '' : 'none' }} class="reaction"> {p.reaction?.result}</div>
                          <Card back height={'8em'} />
                          <p style={{ color: 'white', marginTop: '10px' }}>{p.name} ({p.cards})</p>
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
                <div className="drawpile" style={{ marginBottom: "30px", marginTop: "30px", margin:"30px" }}>
                  {drawPile
                    ? <Card card={drawPile} height={'8em'} />
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
                    <span>Actual reaction: {drawPile ? game.rules[drawPile[0]] : ''}</span>
                  </div>
                  <h5>{displayRoundLoser ? 'Round loser: ' + game.roundLoser : ''}</h5>
                  </div>
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