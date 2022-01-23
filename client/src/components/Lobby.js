/* eslint-disable react-hooks/exhaustive-deps */
import { Row, Col, Button, Container } from 'react-bootstrap'
import { useContext, useEffect } from "react"
import { useHistory } from "react-router"
import PopupWindow from "./overlay/PopupWindow";
import Popup from "./overlay/Popup";
import React, { useState } from 'react';
import gameService from "../services/gameService"
import { useHands } from '../hooks/useHands';
import { Image } from 'react-bootstrap';
import gamegif3 from '../images/user3.gif';
import { setCallbacks } from '../services/socketio/lobbyHandlers';
import { AuthContext } from '../contexts/AuthContext';


const Lobby = ({ socket, game, gameDispatch }) => {
  const { userState: authState } = useContext(AuthContext)
  const [modalShow, setModalShow] = useState(false)
  const [ready, setReady] = useState(false)
  const [unreadyList, setUnreadyList] = useState([])
  const [unreadyShow, setUnreadyShow] = useState(false)
  const history = useHistory()
  const hands = useHands()

  // socket listeners
  useEffect(() => {
    setCallbacks(socket, gameDispatch, setUnreadyList, setUnreadyShow, hands, game, history)
  }, [])

  useEffect(() => {
    hands.initialiseHands()
  }, [])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(stream => stream.getTracks().forEach(track => track.stop()))
      .catch(() => console.log('nay'))
  }, [])

  const startGame = () => {
    // create cards at the backend
    gameService.getCards(game.id)
    socket.emit('start game', { gameId: game.id })
  }

  const onReady = () => {
    socket.emit('ready', { gid: authState.user.id, gameId: game.id })
    setReady(true)
  }

  return (
    <Col className="px-4">
      <Popup show={unreadyShow} onHide={() => setUnreadyShow(false)}
        text={<div>The following players aren't ready !<div><ol>{unreadyList.map(p => <li key={p.gid}>{p.name}</li>)}</ol></div></div>} />

      <Row className="justify-content-center mt-5">
        <Col xs="auto" >
          <Image src={gamegif3} roundedCircle width="230px" height="230px " />
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6} lg={4}>
          <p className="title-Text" >Players</p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Container>
            <ol className="body-Text">
              {
                Object.keys(game.players).map(key => game.players[key])
                  .map(p => {
                    return (<li key={p.gid}>{p.name}</li>)
                  })
              }
            </ol>
          </Container>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          {
            game.host
              ? <Button disabled={!hands.loaded} className="w-100" onClick={startGame}>{hands.loaded ? 'Begin' : 'Loading assets, please wait'}</Button>
              : <Button variant="success" className="w-100" onClick={onReady} disabled={!hands.loaded || ready}>Ready</Button>
          }
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Button className="mt-2 w-100" variant="primary" onClick={() => setModalShow(true)}>
            Game Id
          </Button>
          <PopupWindow text={game.id}
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
        </Col>
      </Row>
    </Col>
  )
}

export default Lobby