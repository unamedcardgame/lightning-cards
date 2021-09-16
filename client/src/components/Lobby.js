import { Container, Row, Col } from 'react-bootstrap'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Lobby = () => {
    const { state: authState } = useContext(AuthContext)

    
return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col className="col-auto text-center">
          <p>welcome {authState?.user.name} !</p>
         <p>Waiting lobby</p>
         
        </Col>
      </Row>
    </Container>
  )
}

export default Lobby