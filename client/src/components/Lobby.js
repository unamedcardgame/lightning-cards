import { useEffect } from "react"

const Lobby = ({ socket }) => {

  useEffect(() => {
    socket.on('new player', (user) => {
      console.log(user.name, 'joined !')
    })
  }, [socket])

  return (
    <div>

    </div>
  )
}

export default Lobby