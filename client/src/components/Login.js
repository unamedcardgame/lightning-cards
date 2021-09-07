import { GoogleLogin } from 'react-google-login';


const Login = ({ setUser }) => {

  const responseGoogle = (response) => {
    setUser(response)
  }
  return (
    <div style={{ marginTop: '1em' }}>
      <GoogleLogin
        clientId="967141828200-04u0p1gcc6v9rp7g85roqr3dic0hvmq6.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  )
}

export default Login