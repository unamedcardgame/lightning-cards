import { Navbar, Nav, Container } from 'react-bootstrap'
import Logout from './auth/Logout';

const NavigationBar = ({userState}) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Welcome To Lightning Cards!<sub style={{marginLeft: '0.5em'}}>beta</sub></Navbar.Brand>
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
  )
}

export default NavigationBar