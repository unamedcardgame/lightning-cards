import Login from './auth/Login';
import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap'

const Home = () => {
  const [user, setUser] = useState({})

  console.log(user)

  if (Object.keys(user).length === 0) {
    return (
      <Login setUser={setUser} />
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