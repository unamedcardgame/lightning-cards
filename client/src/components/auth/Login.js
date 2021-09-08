import { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios'

const Login = () => {
  const { dispatch } = useContext(AuthContext)

  const responseGoogle = (response) => {
    console.log(response)
    dispatch({
      type: 'LOGIN', payload: {
        user: { name: response.profileObj.name, email: response.profileObj.email },
        token: response.tokenId
      }
    })
    axios.get('/api', {
      headers: { Authorization: `bearer ${response.tokenId}` }
    })
    // TODO(Eric): make an axios abstraction

  }

  return (
    <div className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
      <p>welcome to lightning cards !</p>
      <span>
        <GoogleLogin
          clientId="1009598541430-qqds8odu93uk62hngvvg5qim1hfscq0v.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      </span>
    </div>
  )
}

export default Login