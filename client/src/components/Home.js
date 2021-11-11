import Login from './auth/Login';
import { createRef, useContext, useState } from 'react';
import { Row, Col } from 'react-bootstrap'
import { AuthContext } from '../contexts/AuthContext';
import { Button } from 'react-bootstrap'
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
          user: { userId: authState.user.id, name: authState.user.name },
        })

        tempSocket.on('joined', () => {
          gameDispatch(addPlayer({ name: authState.user.name, sid: tempSocket.id }))
          history.push('/lobby')
        })

        setSocket(tempSocket) // set socket state
      } // TODO(): fail gracefully on error
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
          user: { name: authState.user.name }
        })

        tempSocket.on('player list', (playerList) => {
          gameDispatch(setGameId(joinCode))
          playerList.forEach(p => gameDispatch(addPlayer({ name: p.name, sid: p.sid })))
          gameDispatch(addPlayer({ name: authState.user.name, sid: tempSocket.id }))
          history.push('/lobby')
        })
        setSocket(tempSocket) // set socket state
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
    <Row className="tableCenter1">
      <Col className="text-center">
        <Popup text={popupConfig.msg}
          show={popupConfig.show}
          onHide={() => setPopupConfig({ ...popupConfig, show: false })}
        />
        <div>
        <Image src={logo1}  roundedCircle width="250" height="250" />
        </div>
        <Row>
          <p className="title-Text" style={{fontSize: '2em'}}>  Welcome  {authState?.user.name} !</p>
        </Row>
        <Row>
          <Button onClick={handleCreate}>Create New Game</Button>
        </Row>
        <Row>
          <Button onClick={() => setisJoinVisible(!isJoinVisible)} className="mt-2">Join Game</Button>
        </Row>
        <Row className="justify-content-center" style={{ display: isJoinVisible ? null : 'none' }} >
          <input ref={joinCodeInputRef} className="form-control mt-2 w-75" style={{ marginRight: '1px' }} placeholder="Enter Game ID" />
          <Button onClick={handleJoin} className="w-25 mt-1">Go</Button>
        </Row>
      </Col>
    </Row>
  )
}

export default Home