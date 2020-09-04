open Cards;

[@react.component]
let make = () => {
  let (player, setPlayer) = React.useState(() => Player1);
  let changePlayer = () => {
    setPlayer(nextPlayer);
  };

  <div>
    <p> {React.string("Player: " ++ showPlayer(player))} </p>
    <div style={ReactDOMRe.Style.make(~width="900px", ~height="900px", ())}>
      <Cards changePlayer player />
    </div>
  </div>;
};
