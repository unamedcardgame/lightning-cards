/* eslint-disable react-hooks/exhaustive-deps */
import { Row, Col, Button } from 'react-bootstrap'
import { useEffect } from "react"
import { useHistory } from "react-router"
import Popup from "./overlay/PopupWindow";
import React, { useState } from 'react';
import gameService from "../services/gameService"
import { useHands } from '../hooks/useHands';
import { addPlayer, setCardLengths, setRules } from '../reducers/gameReducer';
import { Image } from 'react-bootstrap';
import gamegif1 from '../images/game1.gif';
import gamegif2 from '../images/user1.png';
import gamegif3 from '../images/user3.gif';



const Lobby = ({ socket, game, gameDispatch }) => {
  const [modalShow, setModalShow] = useState(false)
  const [ready, setReady] = useState(false)
  const [unreadyList, setUnreadyList] = useState([])
  const [unreadyShow, setUnreadyShow] = useState(false)
  const history = useHistory()
  const hands = useHands()

  // socket listeners
  useEffect(() => {
    // console.log('nl')
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
      setUnreadyList(unreadyList)
      setUnreadyShow(true)
    })

    // on game start socket handler
    socket.on('begin', async () => {
      hands.closeHands()
      const { rules } = await gameService.getRules(game.id)
      gameDispatch(setRules(rules))
      history.push('/floor')
    })
  }, [])

  useEffect(() => {
    console.log('initting')
    hands.initialiseHands()
  }, [])

  useEffect(() => {
    console.log('wtf')
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
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
    <Row className="tableCenter1">
      <Popup show={unreadyShow} onHide={() => setUnreadyShow(false)} text={<div><p>Following players aren't ready !</p><ol>{unreadyList.map((p, i) => <li key={i}>{p}</li>)}</ol></div>} />
      <Col style={{ fontSize: "2em"}} className="col-auto text-center">
        <Image src={gamegif3}  roundedCircle width="230px" height="230px " />
        <strong><p className="title-Text" >Players</p></strong>
        <ol className="body-Text">
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