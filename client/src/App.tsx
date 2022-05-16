import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom'
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
import { initialGameState } from './reducers/gameReducer';
import { v4 as uuidv4 } from 'uuid'
import { Container, Row } from 'react-bootstrap';
import User from './models/User';

const initialState: User = process.env.NODE_ENV === 'production' ? {
  isAuthenticated: false,
  /*
    Structure of user
    email
    userId
    name
  */
  user: undefined,
  token: undefined,
}
  : {
    isAuthenticated: true,
    user: { name: 'appleUser ' + (Math.random() * 100), id: uuidv4(), email: undefined },
    token: undefined,
  }


function App() {
  const [userState, dispatch] = useReducer(userReducer, initialState)
  const [socket, setSocket] = useState(null)
  const [game, gameDispatch] = useReducer(gameReducer, initialGameState)

  return (
    <AuthContext.Provider value={{ userState, dispatch }}>
      <Container className="vh-100 main d-flex flex-column" fluid>
        <Row>
          <NavigationBar userState={userState} />
        </Row>
        <Row className="flex-grow-1">
          <Routes>
            <Route path="/floor" element={<Floor game={game} gameDispatch={gameDispatch} socket={socket} />}>
            </Route>
            <Route path="/lobby" element={<Lobby game={game} gameDispatch={gameDispatch} socket={socket} />}>
            </Route>
            <Route path="/end" element={<Endgame game={game} />}>
            </Route>
            <Route path="/" element={
              userState.isAuthenticated
                ? <Home gameDispatch={gameDispatch} setSocket={setSocket} />
                : <Login />
            }>
            </Route>
          </Routes>
        </Row>
      </Container>
    </AuthContext.Provider>
  )
}

export default App;
