/* eslint-disable react-hooks/exhaustive-deps */
import { Row, Col, Button } from 'react-bootstrap'
import { useEffect } from "react"
import { useHistory } from "react-router"
import Popup from "./overlay/PopupWindow";
import React, { useState } from 'react';
import gameService from "../services/gameService"
import { useHands } from '../hooks/useHands';
import { addPlayer, setCardLengths } from '../reducers/gameReducer';


const Lobby = ({ socket, game, gameDispatch }) => {
  const [modalShow, setModalShow] = useState(false)
  const [ready, setReady] = useState(false)
  const history = useHistory()
  const hands = useHands()

  // socket listeners
  useEffect(() => {
    console.log('nl')
    // new player socket handler
    socket.on('new player', (user) => {
      gameDispatch(addPlayer({ name: user.name, sid: user.sid }))
    })

    // on cards ready handler
    socket.on('cards info', (cardsList) => {
      // set no. of cards
      gameDispatch(setCardLengths(cardsList))
    })

    socket.on('unready', unreadyList => {
      console.log('bc', unreadyList)
    })

    // on game start socket handler
    socket.on('begin', () => {
      hands.closeHands()
      history.push('/floor')
    })
  }, [])

  useEffect(() => {
    console.log('initting')
    hands.initialiseHands()
  }, [])

  useEffect(() => {
    console.log('wtf')
    navigator.mediaDevices.getUserMedia({audio: true, video: true})
      .then(stream => stream.getTracks().forEach(track => track.stop()))
      .catch(() => console.log('nay'))
  }, [])

  const startGame = () => {
    // create cards at the backend
    gameService.getCards(game.id)
    // tell backend to start game via sockets
    socket.emit('start game', { gameId: game.id })
  }

  const onReady = () => {
    socket.emit('ready', { sid: socket.id, gameId: game.id })
    setReady(true)
  }

  return (
    <Row className="m-auto justify-content-center align-items-center h-100">
      <Col className="col-auto text-center">
        <ol style={{ paddingLeft: '0px' }}>
          <strong><p>Players</p></strong>
          {
            Object.keys(game.players).map(key => game.players[key])
              .map((p, i) => <li key={i}>{p.name}</li>)
          }

        </ol>
        <Row className="justify-content-center">
          {
            game.host
              ? <Button disabled={!hands.loaded} className="" onClick={startGame}>{hands.loaded ? 'Begin' : 'Loading assets, please wait'}</Button>
              : <Button variant="success" onClick={onReady} disabled={!hands.loaded || ready}>Ready</Button>
          }
        </Row>
        <Row className="justify-content-center">
          <Button className="mt-2" variant="primary" onClick={() => setModalShow(true)}>
            Game Id
          </Button>
          <Popup text={game.id}
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
        </Row>
      </Col>
    </Row>
  )
}

export default Lobby