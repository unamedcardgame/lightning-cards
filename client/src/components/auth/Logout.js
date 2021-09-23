import { GoogleLogout } from 'react-google-login';
import { useHistory } from 'react-router';

const Logout = () => {
  const history = useHistory()

  const onLogout = () => {
    console.log('peace')
    history.push('/')
    history.go(0)
  }

  return (
    <GoogleLogout
      clientId='1009598541430-qqds8odu93uk62hngvvg5qim1hfscq0v.apps.googleusercontent.com'
      render={renderProps => (
        <button style={{ paddingLeft: '0px' }} className="a-link" onClick={renderProps.onClick} disabled={renderProps.disabled}>
          Logout
        </button>
      )}
      onLogoutSuccess={onLogout}
    ></GoogleLogout>
  )
}

export default Logout