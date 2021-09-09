import { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios'

const Login = () => {
  const { dispatch } = useContext(AuthContext)

  const responseGoogle = async (response) => {
    console.log(response)
    const resp = (await axios.get('/login', {
      headers: { Authorization: `bearer ${response.tokenId}` }
    })).status
    if (resp === 200) {
      dispatch({
        type: 'LOGIN', payload: {
          user: { name: response.profileObj.name, email: response.profileObj.email,
            id: response.googleId },
          token: response.tokenId
        }
      })
    } else {
      // error logging in
    }
    // TODO(Eric): make an axios abstraction

  }

  const failGoogle = resp => {
    console.log(resp)
  }

  return (
    <div className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
      <p>welcome to lightning cards !</p>
      <span>
        <GoogleLogin
          clientId="1009598541430-qqds8odu93uk62hngvvg5qim1hfscq0v.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={failGoogle}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      </span>
    </div>
  )
}

export default Login