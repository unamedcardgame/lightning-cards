import Login from './auth/Login';
import { createRef, useContext, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import { AuthContext } from '../contexts/AuthContext';
import { Button } from 'react-bootstrap'
import { io } from 'socket.io-client'
import gameService from '../services/gameService';

const Home = () => {
  const { state: authState } = useContext(AuthContext)
  const [isJoinVisible, setisJoinVisible] = useState(false)
  const joinCodeInputRef = createRef()
  const [socket, setSocket] = useState()

  const handleCreate = async () => {
    // get game id from backend api
    const response = await gameService.createGame(authState.user.id)
    const gameId = response.data.gameId

    // if game is created at backend successfully
    if (response.status === 201) {
      const tempSocket = io('/games')
      tempSocket.emit('join', { gameId, isHost: true })

      tempSocket.on('joined', () => {
        // TODO(): transition to waitlist here
        console.log('joined successfully')
      })
      setSocket(tempSocket)
    } // TODO(): handle unsuccessful game creation
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    const tempSocket = io('/games')

    // get code from input element
    const joinCode = joinCodeInputRef.current.value
    tempSocket.emit('join', { gameId: joinCode })
    setSocket(tempSocket)
  }

  if (!authState.isAuthenticated) {
    return (
      <Login />
    )
  }

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col className="col-auto text-center">
          <p>welcome {authState?.user.name} !</p>
          <Button onClick={handleCreate} className="d-inline">create game</Button>
          <Button onClick={() => setisJoinVisible(true)} className="d-inline" style={{ marginLeft: '1em' }}>join game</Button>
          <form>
            <input ref={joinCodeInputRef} style={{ display: isJoinVisible ? null : 'none' }} />
            <input type="submit" onClick={handleJoin} style={{ display: isJoinVisible ? null : 'none' }} />
          </form>
          <Button onClick={() => socket.emit('get details')}>Deets</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default Home