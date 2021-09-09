import Login from './auth/Login';
import { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import { AuthContext } from '../contexts/AuthContext';
import { Button } from 'react-bootstrap'

const Home = () => {
  const { state: authState } = useContext(AuthContext)

  const handleCreate = () => {
    
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
          <Button className="d-inline">create game</Button>
          <Button onClick={handleCreate} className="d-inline" style={{marginLeft: '1em'}}>join game</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default Home