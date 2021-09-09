import Login from './auth/Login';
import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import { AuthContext } from '../contexts/AuthContext';
import { Button } from 'react-bootstrap'
import { io } from 'socket.io-client'

const Home = () => {
  const { state: authState } = useContext(AuthContext)
  const [socket, setSocket] = useState()

  useEffect(() => {
    if (authState.isAuthenticated) setSocket(io())
    
  }, [authState.isAuthenticated])

  const handleCreate = () => {
    
    socket.emit('create game', {id: authState.user.id})
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
          <Button  className="d-inline" style={{marginLeft: '1em'}}>join game</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default Home