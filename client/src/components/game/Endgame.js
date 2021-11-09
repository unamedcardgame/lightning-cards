const Endgame = ({ game, gameDispatch, socket }) => {
  return (
    <div>winner: {game.winner.name}</div>
  )
}

export default Endgame