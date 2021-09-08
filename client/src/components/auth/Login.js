import { GoogleLogin } from 'react-google-login';


const Login = ({ setUser }) => {

  const responseGoogle = (response) => {
    setUser(response)
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