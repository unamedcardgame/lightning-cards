import './App.css';
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/auth/Login'
import Logout from './components/auth/Logout';
import { useReducer, useState } from 'react';
import userReducer from './reducers/UserReducer';
import { AuthContext } from './contexts/AuthContext';
import Floor from './components/Floor';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
}

function App() {
  const [userState, dispatch] = useReducer(userReducer, initialState)
  const [socket, setSocket] = useState(null)

  return (
    <AuthContext.Provider value={{ userState, dispatch }}>
      <div className="main d-flex flex-column">
        <div className="d-flex justify-content-end">
          <Logout />
        </div>
        <Switch>
          <Route path="/floor">
            {console.log('i lau socket', socket)}
            <Floor socket={socket} />
          </Route>
          <Route path="/">
            {
              userState.isAuthenticated
                ? <Home socket={socket} setSocket={setSocket} />
                : <Login />
            }
          </Route>
        </Switch>
      </div>
    </AuthContext.Provider>
  )
}

export default App;
