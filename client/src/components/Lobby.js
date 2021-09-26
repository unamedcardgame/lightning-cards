import { Row, Col, Button } from 'react-bootstrap'
import { useEffect } from "react"
import { useHistory } from "react-router"
import Popup from "./overlay/PopupWindow";
import React, { useState } from 'react';
import gameService from "../services/gameService"
import { useHands } from '../hooks/useHands';


const Lobby = ({ socket, game, setGame }) => {
  const [modalShow, setModalShow] = useState(false);
  const history = useHistory()
  const hands = useHands()

  // socket listeners
  useEffect(() => {
    // new player socket handler
    socket.on('new player', (user) => {
      console.log(user.name, 'joined !')

      setGame({ ...game, players: [...game.players, user.name] }) // TODO(): get authstate context and put userId
    })

    // on cards ready handler
    socket.on('cards', (cards) => {
      setGame({ ...game, cards: cards.length })
    })

    // on game start socket handler
    socket.on('begin', () => {
      history.push('/floor')
    })
  })

  const startGame = () => {
    // close hands (not sure if necessary, but safety and whatnot)
    hands.closeHands()
    // create cards at the backend
    gameService.getCards(game.id)
    // tell backend to start game via sockets
    socket.emit('start game', { gameId: game.id })
  }

  return (
    <Row className="m-auto justify-content-center align-items-center h-100">
      <Col className="col-auto text-center">
        <ol style={{paddingLeft: '0px'}}>
          <strong><p>Players</p></strong>
          {game.players.map((p, i) => <li key={i}>{p}</li>)}

        </ol>
        <Row className="justify-content-center">
          {
            game.host
              ? <Button disabled={!hands.loaded} className="" onClick={startGame}>{hands.loaded ? 'Begin' : 'Loading assets, please wait'}</Button>
              : null
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