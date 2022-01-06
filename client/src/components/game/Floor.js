/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Popup from '../overlay/Popup'
import { Button } from 'react-bootstrap'
import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'
import { useState, useEffect, Fragment, useRef } from 'react'
import { Container, Row } from 'react-bootstrap'
import { setCallbacks } from '../../services/socketio/floorHandlers';
import { useHands } from '../../hooks/useHands';
import { useHistory } from 'react-router'
import { objectMap } from '../../utils/jsUtils'
import SweetAlert from 'react-bootstrap-sweetalert'
import party from 'party-js'

const loserMessages = ['Brush yourself off, pardner', 'Speechless', 'Better Luck Next Time!', 'You can do better!', 'Maybe try reacting ALT-F4 next time.', 'LMAO', 'Shucks, just missed :(', 'What does this guy think of himself?', 'Close!']

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

  const [timer, setTimer] = useState(0)

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
      playerResultToggles, setPlayerResultToggles, setDisplayRoundLoser, setTimer, game.players, party, setNote)
  }, [])

  useEffect(() => {
    hands.initialiseCanvasAndGE()
  }, [])

  useEffect(() => {
    const countTime = process.env['NODE_ENV'] === 'development' ? 0 : 10000
    setInterval(() => setIsCountingDown(false), countTime)
  }, [setIsCountingDown])

  const drawCard = (p) => {
    console.log(game.rules)
    if (drawPile.length === 0 || (p.sid === socket.id && ['K', 'Q', 'A', 'J', 'T'].every(c => drawPile[drawPile.length - 1][0] !== c))) {
      // action draw card
      socket.emit('draw card', { sid: socket.id, gameId: game.id })

    }
  }

  return (
    <Container fluid className="h-100 p-3 pt-0">
      <SweetAlert
        show={isCountingDown}
        info
        title='Patience'
        onConfirm={() => { }}
        customButtons={<Fragment>
        </Fragment>}
        style={{ color: 'black' }}
      >Rome wasn't built in a day.</SweetAlert>
      <div className="div-right text-center">
        <video style={{ display: 'none' }} ref={hands.videoRef} className="input_video" crossOrigin="anonymous" playsInline={true}></video>
        <canvas ref={hands.canvasRef} className="output_canvas" width="360" height="250px"></canvas>
        <div className="container">
          <div className="box" style={{ fontSize: "30px" }} >
            {!isListening ? <span> 🎙️ </span> : <span> 🛑🎙️ </span>}
            <Button className="button-35" onClick={toggleVoiceReaction}>
              {isListening ? 'SUBMIT your reaction !' : 'Record Voice Reaction'}
            </Button>
            <p style={{ fontSize: "20px" }}>{note}</p>
          </div>
        </div>
      </div>
      <div className="div-left">
        <div >
          <Button className="button-35" style={{ marginTop: '1em' }} variant="primary" onClick={() => setModalShow(true)}> Rules</Button>
          <Popup
            text={
              <div>
                <span>👑 K: </span><span style={{ marginLeft: '1em' }}>🔫 PewPew</span><br />
                <span>👸 Q: </span><span style={{ marginLeft: '0.8em' }}>✌️ Peace</span><br />
                <span>🇯 J: </span><span style={{ marginLeft: '1em' }}>🗣️ 'Good morning sir'</span><br />
                <span>🅰️ A: </span><span style={{ marginLeft: '0.9em' }}>🤘 Rockon</span><br />
                <span>🔟 T: </span><span style={{ marginLeft: '1em' }}>👌 Okay</span><br />
              </div>
            }
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
        </div>
        <div style={{ marginTop: "10px", fontSize: "30px", float: "left", display: timer !== 0 ? '' : 'none' }}> ⏱️ {timer}</div>
      </div>
      <div className="h-100 container-fluid" style={{ display: isCountingDown ? 'none' : '' }}>
        <table className="tableCenter"  >
          <tbody>
            <tr>
              {
                Object.keys(game.players).map(key => ({ ...game.players[key], sid: key }))
                  .map(p => {
                    return (
                      <td key={p.id}>
                        <div id={p.sid} className={p.turn ? 'player player-turn' : 'player'} style={{ marginTop: "1em", marginLeft: '2em', textAlign: 'center' }} key={p.id} onClick={() => drawCard(p)}>
                          <Card back height={'8em'} style={{ margin: 'auto' }} />
                          <span style={{ display: 'inline-block', margin: '0.5em 0.7em 0 0.5em' }}>{p.name} ({p.cards})</span>
                          <span style={{ display: playerResultToggles[p.sid] ? '' : 'none' }} className="reaction">{p.reaction?.result
                            === 'correct' ? '✅' : '❌'}</span>
                        </div>
                      </td>
                    )
                  })
              }
            </tr>
          </tbody>
        </table>
        <Row className="w-100 justify-content-center">
          <table className="draw-pile justify-content-center" >
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
                    <div className="debug" style={{ display: process.env['NODE_ENV'] === 'development' ? 'none' : 'none' }}>
                      Debug
                      <br />
                      <span>You reacted: {game.players[socket.id].reaction?.gesture} </span>
                      <br />
                    </div>
                  </div>
                  <SweetAlert
                    show={displayRoundLoser}
                    danger
                    title={game.roundLoser.name || ''}
                    timeout={3000}
                    onConfirm={() => { }}
                    customButtons={<Fragment>
                    </Fragment>}
                    style={{ color: 'black' }}
                  >
                    {game.roundLoser.name} Reacted <strong><em>{game.roundLoser.reaction}</em></strong>.<br />{loserMessages[Math.floor(Math.random() * loserMessages.length)]}
                  </SweetAlert>
                  {/* </td><td> */}
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </div>
    </Container >
  )
}

export default Floor