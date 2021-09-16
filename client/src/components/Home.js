import Login from './auth/Login';
import { createRef, useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import { AuthContext } from '../contexts/AuthContext';
import { Button } from 'react-bootstrap'
import { io } from 'socket.io-client'
import gameService from '../services/gameService';
import { useHistory } from 'react-router';
// import {Image, Nav } from 'react-bootstrap';
// import Navbar from 'react-bootstrap/Navbar'
import gameBG from "../Images/purpleBG1.jpg";




const Home = () => {
  const { state: authState } = useContext(AuthContext)
  const [isJoinVisible, setisJoinVisible] = useState(false)
  const joinCodeInputRef = createRef()
  const [socket, setSocket] = useState()
  const history = useHistory()

  const handleCreate = async () => {
    // get game id from backend api
    const response = await gameService.createGame(authState.user.id)
    const gameId = response.data.gameId

    // if game is created at backend successfully
    try {
      if (response.status === 201) {
        const tempSocket = io('/games')
        console.log(gameId)
        tempSocket.emit('join', { gameId, isHost: true })

        tempSocket.on('joined', () => {
          history.push('/Lobby')
          console.log('joined successfully')
        })
        setSocket(tempSocket) // set socket state
      } 
    } catch (e) {
      console.log(e.message)
    }
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    const tempSocket = io('/games')

    // get code from input element
    const joinCode = joinCodeInputRef.current.value

    // join game if game id is valid
    try {
      const status = await gameService.joinGame(joinCode)
      if (status === 200) {
        console.log('joined')
        tempSocket.emit('join', { gameId: joinCode })
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
    <div
        class="bg_image"
        style={{
          backgroundImage: 'url('+gameBG+')',
          backgroundSize: "cover",
          height: "100vh",
          color: "#f5f5f5"
        }} >
    <Container fluid className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col className="col-auto text-center">
          <p>welcome {authState?.user.name} !</p>
          <Button onClick={handleCreate} className="d-inline">create game</Button>
          <Button onClick={() => setisJoinVisible(true)} className="d-inline" style={{ marginLeft: '1em' }}>join game</Button>
          <form>
            {
              // TODO(Disha): Ew, make these inputs pretty and aligned (we're
              // using react-bootstrap)
            }
            <input ref={joinCodeInputRef} style={{ display: isJoinVisible ? null : 'none' }} />
            <input type="submit" onClick={handleJoin} style={{ display: isJoinVisible ? null : 'none' }} />
          </form>
          <Button onClick={() => socket.emit('get details')}>Deets</Button>
        </Col>
      </Row>
    </Container>
    </div>
  )
}

export default Home