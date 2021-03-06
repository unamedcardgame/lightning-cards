import Login from './auth/Login';
import { createRef, Dispatch, MouseEventHandler, SetStateAction, useContext, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap'
import { AuthContext } from '../contexts/AuthContext';
import { io } from 'socket.io-client'
import gameService from '../services/gameService';
import { useNavigate } from 'react-router';
import Popup from './overlay/PopupWindow';
import logo1 from '../images/Logo2.png';
import { Image } from 'react-bootstrap';
import { setHost, addPlayer, setGameId, GameActionKind } from '../reducers/gameReducer';
import { Socket } from 'socket.io-client';
import Action from '../models/Action';
import Player from '../models/Player';


const Home = ({ setSocket, gameDispatch }: {
  setSocket: Dispatch<SetStateAction<Socket<any, any> | undefined>>
  gameDispatch: Dispatch<Action<GameActionKind>>
}) => {
  const { userState: authState } = useContext(AuthContext)
  const [isJoinVisible, setisJoinVisible] = useState(false)
  const [popupConfig, setPopupConfig] = useState({ msg: '', show: false })
  const joinCodeInputRef = createRef<HTMLInputElement>()
  const navigate = useNavigate()

  const handleCreate = async () => {
    // if game is created at backend successfully
    try {
      // get game id from backend api
      const response = await gameService.createGame()
      const gameId = response.data.gameId

      gameDispatch(setGameId(gameId))
      gameDispatch(setHost())

      if (response.status === 201) {
        const tempSocket = process.env['NODE_ENV'] === 'development' ? io('/games') : io('https://lightning-cards-api.herokuapp.com/games')
        tempSocket.emit('join', {
          game: { gameId, isHost: true },
          user: { id: authState.user.id, name: authState.user.name },
        })

        setSocket(tempSocket) // set socket state
        gameDispatch(addPlayer({ name: authState.user.name, gid: authState.user.id, turn: false, cards: 0, reaction: { result: null, gesture: null } }))
        navigate('/lobby')

      }
    } catch (e) {
      setPopupConfig({ msg: 'Error creating game at backend, please try again later', show: true })
    }
  }

  const handleJoin = async (e: SubmitEvent) => {
    e.preventDefault()
    const tempSocket = process.env['NODE_ENV'] === 'development' ? io('/games') : io('https://lightning-cards-api.herokuapp.com/games')

    // get code from input element
    const joinCode = joinCodeInputRef?.current?.value
    if (!joinCode) {
      // TODO(7): disable joingame button or something
      return;
    }

    // join game if game id is valid
    try {
      const status = await gameService.joinGame(joinCode)
      if (status === 200) {
        setSocket(tempSocket)
        tempSocket.emit('join', {
          game: { gameId: joinCode },
          user: { id: authState.user.id, name: authState.user.name }
        })

        tempSocket.on('player list', (playerList: Player[]) => {
          gameDispatch(setGameId(joinCode))
          // add other players
          playerList.forEach(p => gameDispatch(addPlayer({ name: p.name, gid: p.gid, turn: false, cards: 0, reaction: { result: null, gesture: null } })))
          navigate('/lobby')
        })
      }
    } catch (e: any) {
      console.log(e.message)
    }
  }

  if (!authState.isAuthenticated) {
    return (
      <Login />
    )
  }

  return (
    <Col className="px-4">

      <Popup text={popupConfig.msg}
        show={popupConfig.show}
        onHide={() => setPopupConfig({ ...popupConfig, show: false })}
      />
      <Row className="justify-content-center mt-5">
        <Col xs="auto">
          <Image src={logo1} roundedCircle width="250" height="250" />
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6} lg={4}>
          <p className="title-Text" style={{ fontSize: '2em' }}> ??? Welcome ??? <br /> {authState?.user.name} </p>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6} lg={4}>
          <Button className="w-100" onClick={handleCreate}>Create New Game</Button>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Button className="w-100 mt-2" onClick={() => setisJoinVisible(!isJoinVisible)}>Join Game</Button>
        </Col>
      </Row>
      <Row className="justify-content-center mt-2" style={{ display: isJoinVisible ? undefined : 'none' }} >
        <Col className="pe-md-0" md={4} lg={3}>
          <input ref={joinCodeInputRef} className="form-control w-100" placeholder="Enter Game ID" />
        </Col>
        <Col xs={5} md={2} lg={1}>
          <Button className="w-100 mt-1 mt-md-0" onClick={handleJoin as unknown as MouseEventHandler<HTMLButtonElement>}>Go</Button>
        </Col>
      </Row>
    </Col>
  )
}

export default Home