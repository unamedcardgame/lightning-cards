import { Navbar, Nav, Container, Col } from 'react-bootstrap'
import Logout from './auth/Logout';
import User from '../models/User';

const NavigationBar = ({ userState }: { userState: User }) => {
  return (
    <Col className="px-0">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Lightning Cards!<sub style={{ marginLeft: '0.5em' }}>beta</sub></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">
                How To Play ?
              </Nav.Link>
              <div className="d-flex">
                {
                  userState.isAuthenticated
                    ? <Logout />
                    : ""
                }
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Col>
  )
}

export default NavigationBar