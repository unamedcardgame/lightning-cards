import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/auth/Login'
import Logout from './components/auth/Logout';
import { useReducer, useState } from 'react';
import userReducer from './reducers/UserReducer';
import { AuthContext } from './contexts/AuthContext';
import Floor from './components/game/Floor';
import Lobby from './components/Lobby'
import { Navbar, Nav, Container } from 'react-bootstrap'

const initialState = {
  isAuthenticated: false,
  /*
    Structure of user
    email
    userId
    name
  */
  user: null,
  token: null,
}
function App() {
  const [userState, dispatch] = useReducer(userReducer, initialState)
  const [socket, setSocket] = useState(null)
  const [game, setGame] = useState({
    id: null,
    players: [], // TODO(): currently contains ONLY user.name. also add user.i
    host: false,
  })

  return (
    <AuthContext.Provider value={{ userState, dispatch }}>
      <div className="main d-flex flex-column">
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/">Welcome To Lightning Cards</Navbar.Brand>
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
        <Switch>
          <Route path="/floor">
            <Floor game={game} setGame={setGame} socket={socket} />
          </Route>
          <Route path="/lobby">
            <Lobby game={game} setGame={setGame} socket={socket} />
          </Route>
          <Route exact path="/">
            {
              userState.isAuthenticated
                ? <Home game={game} setGame={setGame} socket={socket} setSocket={setSocket} />
                : <Login />
            }
          </Route>
        </Switch>
      </div>
    </AuthContext.Provider>
  )
}

export default App;
