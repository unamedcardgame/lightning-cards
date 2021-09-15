import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'
import { Container } from 'react-bootstrap'

const Floor = () => {

  return (
    <Container fluid className="h-100">
      <div className="">
        <Card card={'2c'} height={'6em'} />
      </div>
    </Container>
  )
}

export default Floor