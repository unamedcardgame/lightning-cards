import { useEffect } from "react"
import { Button } from 'react-bootstrap'
import { useHistory } from "react-router"

import Popup from "./overlay/PopupWindow";
import React, { useState } from 'react';

import gameService from "../services/gameService"


const Lobby = ({ socket, game, setGame }) => {
  const [modalShow, setModalShow] = useState(false);
  const history = useHistory()

  useEffect(() => {
    // new player socket handler
    socket.on('new player', (user) => {
      console.log(user.name, 'joined !')

      setModalShow(true)

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
  }, [game, history, setGame, socket])

  const startGame = () => {
    // create cards at the backend
    gameService.getCards(game.id)
    // tell backend to start game via sockets
    socket.emit('start game', { gameId: game.id })

  }

  return (
    <div>
      <ol>
        Players List
        {game.players.map((p, i) => <li key={i}>{p}</li>)}

      </ol>
      {
        game.host
          ? <div>
            <ol>
              <Button className="d-block mb-2" onClick={startGame}>Begin</Button>
              <Button variant="primary" onClick={() => setModalShow(true)}>
                Game Id
              </Button>
              <Popup text={game.id}
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </ol>
          </div>

          : null
      }

    </div>
  )
}

export default Lobby