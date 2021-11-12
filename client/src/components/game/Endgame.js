import { Image } from 'react-bootstrap';
import gif1 from '../../images/trophy1.gif';

const Endgame = ({ game }) => {

  return (
    <div className="centerImage1">
      <Image src={gif1} roundedCircle width="470" height="470" />
      {/* <Image src={gif2} roundedCircle width="270" height="270" /> */}

      <div className="winner-Text">
        {/* Winner : Disha Bundela */}
        Congratulations {game.winner.name} ! 🥳🎉
      </div>
    </div>
  )
}

export default Endgame