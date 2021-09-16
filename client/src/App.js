import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route } from 'react-router-dom'
import Home from './Components/Home'
import Login from './Components/auth/Login'
import Logout from './Components/auth/Logout';
import { useReducer } from 'react';
import userReducer from './reducers/UserReducer';
import { AuthContext } from './contexts/AuthContext';
import Lobby from './Components/Lobby';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
}
function App() {
  const [state, dispatch] = useReducer(userReducer, initialState)
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <div className="main d-flex flex-column">
        <div className="d-flex justify-content-end">
            {
              state.isAuthenticated
                ? <Logout />
                : ""
            }
        </div>
        <Switch>
          <Route path="/Lobby">
            <Lobby/>
          </Route>
          <Route path="/">
            {
              state.isAuthenticated
                ? <Home />
                : <Login />
            }
          </Route>
        </Switch>
      </div>
    </AuthContext.Provider>
  )
}

export default App;
