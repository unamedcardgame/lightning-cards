import Login from './auth/Login';
import { createRef, useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import { AuthContext } from '../contexts/AuthContext';
import { Button } from 'react-bootstrap'
import { io } from 'socket.io-client'
import gameService from '../services/gameService';
import { useHistory } from 'react-router';

const Home = ({ socket, setSocket, game, setGame }) => {
  const { userState: authState } = useContext(AuthContext)
  const [isJoinVisible, setisJoinVisible] = useState(false)
  const joinCodeInputRef = createRef()
  const history = useHistory()

  const handleCreate = async () => {
    // get game id from backend api
    const response = await gameService.createGame()
    const gameId = response.data.gameId

    // set game data in FRONTEND state
    setGame({
      ...game,
      id: gameId,
      players: [...game.players, authState.user.name],
      host: true,
    })

    // if game is created at backend successfully
    try {
      if (response.status === 201) {
        const tempSocket = io('/games')
        tempSocket.emit('join', {
          game: { gameId, isHost: true },
          user: { userId: authState.user.id, name: authState.user.name },
        })

        tempSocket.on('joined', () => {
          // TODO(Disha): transition to lobby page from here
          // use reactrouter's history.push('/lobby') or whatever
          console.log('joined successfully')
          history.push('/lobby')
        })

        setSocket(tempSocket) // set socket state
      } // TODO(): fail gracefully on error
    } catch (e) {
      console.log(e.message)
    }
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    const tempSocket = io('/games')

    // get code from input element
    const joinCode = joinCodeInputRef.current.value

    // join game if game id is valid
    try {
      const status = await gameService.joinGame(joinCode)
      if (status === 200) {
        console.log('joined')
        tempSocket.emit('join', {
          game: { gameId: joinCode },
          user: { name: authState.user.name }
        })

        tempSocket.on('player list', (playerNames) => {
          // set game data in FRONTEND state
          setGame({
            ...game,
            id: joinCode,
            players: [...playerNames],
          })
          console.log(playerNames)
          history.push('/lobby')
        })
        setSocket(tempSocket) // set socket state
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  if (!authState.isAuthenticated) {
    return (
      <Login />
    )
  }

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col className="col-auto text-center">
          <p>welcome {authState?.user.name} !</p>
          <Button onClick={handleCreate} className="d-inline">create game</Button>
          <Button onClick={() => setisJoinVisible(true)} className="d-inline" style={{ marginLeft: '1em' }}>join game</Button>
          <form>
            {
              // TODO(Disha): Ew, make these inputs pretty and aligned (we're
              // using react-bootstrap)
            }
            <input ref={joinCodeInputRef} style={{ display: isJoinVisible ? null : 'none' }} />
            <input type="submit" onClick={handleJoin} style={{ display: isJoinVisible ? null : 'none' }} />
          </form>
          <Button onClick={() => {
            console.log(socket)
            socket.emit('get details')
          }}>Deets</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default Home