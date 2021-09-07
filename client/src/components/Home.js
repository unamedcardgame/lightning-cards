import Login from './Login';
import { useState } from 'react';

const Home = () => {
  const [user, setUser] = useState({})

  console.log(user)

  if (Object.keys(user).length === 0) {
    return (
      <div className="row">
        <span>welcome to lightning cards !</span>
        <Login setUser={setUser} />
      </div>
    )
  }

  return (
    <div>Create or join game here</div>
  )
}

export default Home