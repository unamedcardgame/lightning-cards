import './App.css';
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/auth/Login'
import Logout from './components/auth/Logout';

function App() {

  const isLoggedIn = true

  return (
    <div className="main d-flex flex-column">
      <div className="d-flex justify-content-end">
        <Logout />
      </div>
      <Switch>
        <Route path="/">
          {
            isLoggedIn
            ? <Home />
            : <Login />
          }
        </Route>
      </Switch>
    </div>
  )
}

export default App;
