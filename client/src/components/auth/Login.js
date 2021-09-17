import { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { AuthContext } from '../../contexts/AuthContext';
import userService from '../../services/userService'
import { Row, Col, Container, Image, Nav } from 'react-bootstrap';
import gameBG from "../../Images/purpleBG1.jpg";
import logo from '../../Images/Logo1.png';
import Navbar from 'react-bootstrap/Navbar'

const Login = () => {
  const { dispatch } = useContext(AuthContext)

  const responseGoogle = async (response) => {
    const status = await userService.login(response.tokenId)
    if (status === 200) {
      dispatch({
        type: 'LOGIN', payload: {
          user: {
            name: response.profileObj.name, email: response.profileObj.email,
            id: response.googleId
          },
          token: response.tokenId
        }
      })
    } else {
      // error logging in
    }

  }

  const failGoogle = resp => {
    console.log(resp)
  }

  return (
    <div
        className="bg_image"
        style={{
          backgroundImage: 'url('+gameBG+')',
          backgroundSize: "cover",
          height: "100vh",
          color: "#f5f5f5"
        }}
      >
    <div>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Container>
  <Navbar.Brand href="/">Welcome To Lightning Cards</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
  <Nav className="me-auto">
    </Nav>
    <Nav>
      <Nav.Link  href="/">
        How To Play ?
      </Nav.Link>
    </Nav>
  </Navbar.Collapse>
  </Container>
</Navbar>
  <div >
    <div className="centerImage" >
  <Container>
  <Row>
    <Col xs={6} md={4}>
    <Image src={logo} roundedCircle width="270" height="270" />
    </Col>
  </Row>
</Container>
</div>
  <div className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
      <span>
        <GoogleLogin 
          clientId="1009598541430-qqds8odu93uk62hngvvg5qim1hfscq0v.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={failGoogle}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      </span>
    </div>
  </div>
    
    </div>
    </div>
  )
}

export default Login