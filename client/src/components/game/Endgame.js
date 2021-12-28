import { Image } from 'react-bootstrap';
import gif1 from '../../images/trophy1.gif';

const Endgame = ({ game }) => {

  return (
    <div className="centerImage1">
      <Image src={gif1} roundedCircle width="470" height="470" />
      <div className="winner-Text">
        Congratulations {game.winner.name} ! 🥳🎉
      </div>
    </div>
  )
}

export default Endgame