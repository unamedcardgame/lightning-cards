import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/auth/Login'
import { useReducer, useState } from 'react';
import userReducer from './reducers/UserReducer';
import { AuthContext } from './contexts/AuthContext';
import Floor from './components/game/Floor';
import Lobby from './components/Lobby'
import Endgame from './components/game/Endgame';
import NavigationBar from './components/Navbar';
import gameReducer from './reducers/gameReducer';
import { v4 as uuidv4 } from 'uuid'
import { Container, Row } from 'react-bootstrap';

const initialState = process.env.NODE_ENV === 'production' ? {
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
  : {
    isAuthenticated: true,
    user: { name: 'appleUser ' + parseInt(Math.random() * 100), id: uuidv4() },
    token: null,
  }


function App() {
  const [userState, dispatch] = useReducer(userReducer, initialState)
  const [socket, setSocket] = useState(null)
  const [game, gameDispatch] = useReducer(gameReducer)

  return (
    <AuthContext.Provider value={{ userState, dispatch }}>
      <Container className="vh-100 main d-flex flex-column" fluid>
        <Row>
          <NavigationBar userState={userState} />
        </Row>
        <Row className="flex-grow-1">
          <Switch>
            <Route path="/floor">
              <Floor game={game} gameDispatch={gameDispatch} socket={socket} />
            </Route>
            <Route path="/lobby">
              <Lobby game={game} gameDispatch={gameDispatch} socket={socket} />
            </Route>
            <Route path="/end">
              <Endgame game={game} gameDispatch={gameDispatch} socket={socket} />
            </Route>
            <Route path="/">
              {
                userState.isAuthenticated
                  ? <Home game={game} gameDispatch={gameDispatch} socket={socket} setSocket={setSocket} />
                  : <Login />
              }
            </Route>
          </Switch>
        </Row>
      </Container>
    </AuthContext.Provider>
  )
}

export default App;
