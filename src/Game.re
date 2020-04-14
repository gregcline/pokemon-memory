module Card = {
  [@react.component]
  let make = (~imageId, ~faceUp, ~onClick) => {
    <div
      style={ReactDOMRe.Style.make(
        ~backgroundColor="#333",
        ~borderRadius="0.5rem",
        (),
      )}
      onClick
      className="card">
      <img
        src={j|./static/$imageId.png|j}
        style={ReactDOMRe.Style.make(
          ~display="block",
          ~opacity=faceUp ? "1" : "0",
          ~margin="auto",
          (),
        )}
      />
    </div>;
  };
};

module Cards = {
  open Belt;

  type t = {
    imageId: int,
    cardState: bool,
  };

  [@react.component]
  let make = () => {
    let initialCards = () => {
      let half = Array.makeBy(10, _ => Js.Math.random_int(1, 152));
      let full = Array.concat(half, half);
      full
      ->Array.map(imageId => {{imageId, cardState: false}})
      ->Array.shuffle;
    };
    let (cards, setCards) = React.useState(initialCards);
    let onClick = (i, _) => {
      setCards(cards => {
        switch (cards[i]) {
        | Some(card) =>
          let newCards = Array.copy(cards);
          Array.setExn(newCards, i, {...card, cardState: true});
          newCards;
        | None => cards
        }
      });
    };

    <div
      style={ReactDOMRe.Style.make(
        ~display="grid",
        ~gridTemplateColumns="repeat(5, 18%)",
        ~gridTemplateRows="repeat(4, 18%)",
        ~gridGap="0.5rem",
        (),
      )}>
      {{
         cards->Array.mapWithIndex((i, card) =>
           <Card
             key={string_of_int(i) ++ string_of_int(card.imageId)}
             imageId={card.imageId}
             faceUp={card.cardState}
             onClick={onClick(i)}
           />
         );
       }
       ->React.array}
    </div>;
  };
};

[@react.component]
let make = () => {
  <div style={ReactDOMRe.Style.make(~width="900px", ~height="900px", ())}>
    <Cards />
  </div>;
};
