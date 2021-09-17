import './App.css';
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/auth/Login'
import Logout from './components/auth/Logout';
import { useReducer, useState } from 'react';
import userReducer from './reducers/UserReducer';
import { AuthContext } from './contexts/AuthContext';
import Floor from './components/game/Floor';
import Lobby from './components/Lobby'

const initialState = {
  isAuthenticated: false,
  /*
    Structure of user
    email
    id
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
    players: [],
    host: false,
  })

  return (
    <AuthContext.Provider value={{ userState, dispatch }}>
      <div className="main d-flex flex-column">
        <div className="d-flex justify-content-end">
          <Logout />
        </div>
        <Switch>
          <Route path="/floor">
            <Floor socket={socket} />
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
