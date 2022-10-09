/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import Popup from '../overlay/Popup'
import { Button } from 'react-bootstrap'
import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'
import { useState, useEffect, Fragment, useContext } from 'react'
import { Col, Row } from 'react-bootstrap'
import { setCallbacks } from '../../services/socketio/floorHandlers';
import { useHands } from '../../hooks/useHands';
import { useNavigate } from 'react-router'
import { objectMap } from '../../utils/jsUtils'
import SweetAlert from 'react-bootstrap-sweetalert'
import { AuthContext } from '../../contexts/AuthContext'
import pewpew from '../../images/reactions/pewpew.jpeg'
import ok from '../../images/reactions/ok.jpeg'
import rockon from '../../images/reactions/rockon.jpeg'
import peace from '../../images/reactions/peace.jpeg'

const loserMessages = ['Brush yourself off, pardner', 'Speechless', 'Better Luck Next Time!', 'You can do better!', 'Maybe try reacting ALT-F4 next time.', 'LMAO', 'Shucks, just missed :(', 'What does this guy think of himself?', 'Close!']

const SpeechRecognition =
  window.speechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()
mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

const Floor = ({ game, gameDispatch, socket }) => {
  const { userState: authState } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isCountingDown, setIsCountingDown] = useState(true)
  const [ignoredOne, setIgnoredOne] = useState(false)
  const [playerResultToggles, setPlayerResultToggles] = useState(
    objectMap(game.players, () => false)
  )

  const [displayRoundLoser, setDisplayRoundLoser] = useState(false)
  const [drawPile, setDrawPile] = useState([])
  const hands = useHands(game, gameDispatch, socket, ignoredOne, setIgnoredOne, authState.user.id)
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
          timestamp: new Date().getTime(),
        },
        gameId: game.id,
        gid: authState.user.id
      })
      setIsListening(false)
    } else {
      setIsListening(false)
    }
  }

  useEffect(() => {
    setCallbacks(socket, setDrawPile, gameDispatch, navigate, setIsListening,
      setPlayerResultToggles, setDisplayRoundLoser, setTimer, game.players, setNote)
  }, [setNote])

  useEffect(() => {
    hands.initialiseCanvasAndGE()
  }, [])

  useEffect(() => {
    const countTime = process.env['NODE_ENV'] === 'development' ? 0 : 10000
    setInterval(() => setIsCountingDown(false), countTime)
  }, [setIsCountingDown])

  const drawCard = (p) => {
    console.log(game.rules)
    if (drawPile.length === 0 || (p.gid === authState.user.id && ['K', 'Q', 'A', 'J', 'T'].every(c => drawPile[drawPile.length - 1][0] !== c))) {
      // action draw card
      socket.emit('draw card', { gid: authState.user.id, gameId: game.id })
    }
  }

  return (
    <Col className="d-flex flex-column px-4">
      <SweetAlert
        show={isCountingDown}
        info
        title='Patience'
        onConfirm={() => { }}
        customButtons={<Fragment>
        </Fragment>}
        style={{ color: 'black' }}
      >Rome wasn't built in a day.</SweetAlert>

      <Row className="mt-3">
        <Col xs="auto">
          <Button className="button-35" variant="primary" onClick={() => setModalShow(true)}> Rules</Button>
          <Popup
            text={
              <div>
                <span>👑 K: </span><span style={{ marginLeft: '1em' }}>🔫 PewPew</span><img src={pewpew} height="150" width="150"></img><br />
                <span>👸 Q: </span><span style={{ marginLeft: '0.8em' }}>✌️ Peace</span><img src={peace} height="150" width="150"></img><br />
                <span>🇯 J: </span><span style={{ marginLeft: '1em' }}>🗣️ 'Good morning sir' (Click 'Record Voice Reaction' and say it)</span><br />
                <span>🅰️ A: </span><span style={{ marginLeft: '0.9em' }}>🤘 Rockon</span><img src={rockon} height="150" width="150"></img><br />
                <span>🔟 T: </span><span style={{ marginLeft: '1em' }}>👌 Okay</span><img src={ok} height="150" width="150"></img><br />
              </div>
            }
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          <span style={{ display: timer !== 0 ? '' : '', fontSize: '1.5em' }}> ⏱️ {timer}</span>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <video style={{ display: process.env['NODE_ENV'] === 'development' ? 'none' : '' }} ref={hands.videoRef} className="input_video" width={340} height={250} crossOrigin="anonymous" playsInline={true}></video>
          <canvas ref={hands.canvasRef} style={{ display: process.env['NODE_ENV'] === 'development' ? '' : 'none' }} className="output_canvas" width={340} height={250}></canvas>
        </Col>
      </Row>


      <Row>
        <Col>
          <div className="drawpile" style={{ height: '8em', width: '10em', marginBottom: "30px", marginTop: "30px", margin: "30px" }}>
            {drawPile.length !== 0
              ? drawPile
                .map((c, i) => {
                  const transf = i * 8
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

        </Col>
      </Row>

      <Row className="justify-content-center">
        {
          Object.keys(game.players).map(key => ({ ...game.players[key], gid: key }))
            .map(p => {
              return (
                <Col xs="auto" key={p.gid}>
                  <div id={p.gid} className={p.turn ? 'player player-turn' : 'player'} onClick={() => drawCard(p)}>
                    <Card back height={'8em'} style={{ margin: 'auto' }} />
                    <span style={{}}>{p.name} ({p.cards})</span>
                    <span style={{ display: playerResultToggles[p.gid] ? '' : 'none' }} className="reaction">{p.reaction?.result
                      === 'correct' ? '✅' : '❌'}</span>
                  </div>
                  {p.turn}
                </Col>
              )
            })
        }
      </Row>

      <Row className="justify-content-center flex-grow-1 align-items-end">
        <Col xs="auto">
          <Button className="button-35" onClick={toggleVoiceReaction}>
            <span>{!isListening ? '🎙️' : '🛑🎙️'}</span>
            {isListening ? 'SUBMIT your reaction !' : 'Record Voice Reaction'}
          </Button>
          <p style={{ fontSize: "1.5px" }}>{note}</p>
        </Col>
      </Row>

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

    </Col>
  )
}

export default Floor