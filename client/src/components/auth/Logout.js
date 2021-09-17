import { GoogleLogout } from 'react-google-login';
import { useHistory } from 'react-router';
import Navbar from 'react-bootstrap/Navbar'
import { Row, Col, Container, Image, Nav } from 'react-bootstrap';
import logo from '../../Images/Logo1.png';


const Logout = () => {
  const history = useHistory()

  const onLogout = () => {
    history.go(0)
  }

  return (
    <span>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
        <Container>
            <Row>
              <Col xs={6} md={4}>
              <Image src={logo} roundedCircle width="30" height="30" />
              </Col>
            </Row>
          </Container>
          <Navbar.Brand href="/" className="textLeft">Lightning Cards</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              </Nav>
              <Nav>
                <Nav.Link  href="/">
                <GoogleLogout
                  clientId='1009598541430-qqds8odu93uk62hngvvg5qim1hfscq0v.apps.googleusercontent.com'
                  render={renderProps => (
                    <button className="a-link" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                      Logout
                    </button>
                  )}
                  onLogoutSuccess={onLogout}
                  ></GoogleLogout>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
      
    </span>
  )
}

export default Logout