import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route } from 'react-router-dom'
import Home from './Components/Home'
import Login from './Components/auth/Login'
import Logout from './Components/auth/Logout';
import { useReducer, useState } from 'react';
import userReducer from './reducers/UserReducer';
import { AuthContext } from './contexts/AuthContext';
import Floor from './Components/game/Floor';
import Lobby from './Components/Lobby'

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
            {
              userState.isAuthenticated
                ? <Logout />
                : ""
            }
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
