import './App.css';
import { Switch, Route } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login';

const responseGoogle = (response) => {
  console.log(response);
}

function App() {
  return (
    <div className="main container-fluid">
      <Switch>
        <Route path="/t">
          t
        </Route>
        <Route path="/">
          <div className="content d-inline">welcome to lightning cards !</div>
          <GoogleLogin
            clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
