type player =
  | Player1
  | Player2;

let nextPlayer = (player) => {
    switch(player) {
    | Player1 => Player2
    | Player2 => Player1
    };
};

let showPlayer = (player) => {
    switch(player) {
    | Player1 => "Player 1"
    | Player2 => "Player 2"
    };
};

[@react.component]
let make = () => {
  let (player, setPlayer) = React.useState(() => Player1);
  let changePlayer = () => {
    setPlayer(nextPlayer)
  };

  <div>
      <p>{React.string("Player: " ++ showPlayer(player)) }</p>
      <div style={ReactDOMRe.Style.make(~width="900px", ~height="900px", ())}>
        <Cards changePlayer=changePlayer />
      </div>
  </div>;
};
