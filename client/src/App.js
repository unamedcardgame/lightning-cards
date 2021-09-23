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
import NavigationBar from './components/Navbar';

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

  console.log('us', userState)

  return (
    <AuthContext.Provider value={{ userState, dispatch }}>
      <div className="main d-flex flex-column">
        <NavigationBar userState={userState} />
        <Switch>
          <Route path="/floor">
            <Floor game={game} setGame={setGame} socket={socket} />
          </Route>
          <Route path="/lobby">
            <Lobby game={game} setGame={setGame} socket={socket} />
          </Route>
          <Route path="/">
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
