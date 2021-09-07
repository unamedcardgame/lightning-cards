import './App.css';
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home'

function App() {

  return (
    <div className="main container-fluid">
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
