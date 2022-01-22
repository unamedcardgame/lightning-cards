import Login from './auth/Login';
import { createRef, useContext, useState } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap'
import { AuthContext } from '../contexts/AuthContext';
import { io } from 'socket.io-client'
import gameService from '../services/gameService';
import { useHistory } from 'react-router';
import Popup from './overlay/PopupWindow';
import logo1 from '../images/Logo2.png';
import { Image } from 'react-bootstrap';
import { setHost, addPlayer, setGameId } from '../reducers/gameReducer';

const Home = ({ setSocket, gameDispatch }) => {
  const { userState: authState } = useContext(AuthContext)
  const [isJoinVisible, setisJoinVisible] = useState(false)
  const [popupConfig, setPopupConfig] = useState({ show: false })
  const joinCodeInputRef = createRef()
  const history = useHistory()

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

        tempSocket.on('joined', () => {
          gameDispatch(addPlayer({ name: authState.user.name, sid: tempSocket.id, gid: authState.user.id }))
          history.push('/lobby')
        })

        setSocket(tempSocket) // set socket state
      }
    } catch (e) {
      setPopupConfig({
        msg: 'Error creating game at backend, please try again later',
        show: true
      })
    }
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    const tempSocket = process.env['NODE_ENV'] === 'development' ? io('/games') : io('https://lightning-cards-api.herokuapp.com/games')

    // get code from input element
    const joinCode = joinCodeInputRef.current.value

    // join game if game id is valid
    try {
      const status = await gameService.joinGame(joinCode)
      if (status === 200) {
        tempSocket.emit('join', {
          game: { gameId: joinCode },
          user: { name: authState.user.name, id: authState.user.id }
        })

        tempSocket.on('player list', (playerList) => {
          gameDispatch(setGameId(joinCode))
          playerList.forEach(p => gameDispatch(addPlayer({ name: p.name, gid: p.gid, sid: p.sid })))
          gameDispatch(addPlayer({ name: authState.user.name, sid: tempSocket.id, gid: authState.user.id }))
          history.push('/lobby')
        })
        setSocket(tempSocket)
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  if (!authState.isAuthenticated) {
    return (
      <Login />
    )
  }

  return (
    <Container>

      <Popup text={popupConfig.msg}
        show={popupConfig.show}
        onHide={() => setPopupConfig({ ...popupConfig, show: false })}
      />
      <Row className="justify-content-center mt-5">
        <Col xs="auto">
          <Image src={logo1} roundedCircle width="250" height="250" />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <p className="title-Text" style={{ fontSize: '2em' }}> ⚡ Welcome ⚡ <br /> {authState?.user.name} </p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Button className="w-100" onClick={handleCreate}>Create New Game</Button>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Button className="w-100 mt-2" onClick={() => setisJoinVisible(!isJoinVisible)}>Join Game</Button>
        </Col>
      </Row>
      <Row className="justify-content-center" style={{ display: isJoinVisible ? null : 'none' }} >
        <input ref={joinCodeInputRef} className="form-control mt-2 w-75" style={{ marginRight: '1px' }} placeholder="Enter Game ID" />
        <Button onClick={handleJoin} className="w-25 mt-1">Go</Button>
      </Row>
    </Container>
  )
}

export default Home