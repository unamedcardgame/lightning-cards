import './App.css';
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/auth/Login'
import Logout from './components/auth/Logout';
import { useReducer } from 'react';
import userReducer from './reducers/UserReducer';
import { AuthContext } from './contexts/AuthContext';

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
          <Logout />
        </div>
        <Switch>
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
