import Login from './auth/Login';
import { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const { state: authState } = useContext(AuthContext)

  if (!authState.isAuthenticated) {
    return (
      <Login/>
    )
  }

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col className="col-auto">
          <p>create or join game</p>
        </Col>
      </Row>
    </Container>
  )
}

export default Home