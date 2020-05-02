type cardState =
| FaceDown
| FaceUp
| Matched;

module Card = {
  [@react.component]
  let make = (~imageId, ~cardState, ~onClick) => {
      let cardOpacity = switch(cardState) {
      | FaceUp => "1"
      | FaceDown => "0"
      | Matched => "0.5"
      };
    <div
      style={ReactDOMRe.Style.make(
        ~backgroundColor="#333",
        ~borderRadius="0.5rem",
        (),
      )}
      onClick
      className="card">
      {
      if (cardState == Matched) {
        <div
            style={ReactDOMRe.Style.make(
                    ~padding="1em",
                    ~position="absolute",
                    ~color="#BBB",
                    ())
            }>
        {React.string({j|✓|j})}
        </div>
      } else {
          React.null
      }
      }
      <img
        src={j|./static/$imageId.png|j}
        style={ReactDOMRe.Style.make(
          ~display="block",
          ~opacity=cardOpacity,
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
    cardIndex: int,
    imageId: int,
    cardState,
  };

  type selections =
    | NoSelection
    | First(t)
    | Second(t, t);

  let matches = (card1, card2) => {
    card1.imageId == card2.imageId
    && card1.cardState != Matched
    && card2.cardState != Matched;
  };

  let flipCard = (cards, i, card) => {
    let newCards = Array.copy(cards);
    let newState =
      switch (card.cardState) {
      | FaceUp => FaceDown
      | FaceDown => FaceUp
      | Matched => Matched
      };
    Array.setExn(newCards, i, {...card, cardState: newState});
    newCards;
  };

  let setMatched = (cards, card) => {
    let newCards = Array.copy(cards);
    Array.setExn(newCards, card.cardIndex, {...card, cardState: Matched});
    newCards;
  };

  let addSelection = (card, selections) => {
    switch (selections) {
    | NoSelection => First(card)
    | First(firstCard) => Second(firstCard, card)
    | second => second
    };
  };

  [@react.component]
  let make = () => {
    let initialCards = () => {
      let half = Array.makeBy(10, _ => Js.Math.random_int(1, 152));
      let full = Array.concat(half, half);
      full
      ->Array.map(imageId => {{cardIndex: 0, imageId, cardState: FaceDown}})
      ->Array.shuffle
      ->Array.mapWithIndex((cardIndex, card) => {...card, cardIndex});
    };
    let (cards, setCards) = React.useState(initialCards);
    let (selections, setSelections) = React.useState(() => NoSelection);

    React.useEffect1(
      () => {
        let timeOut =
          Js.Global.setTimeout(
            () => {
              switch (selections) {
              | Second(card1, card2) =>
                if (!matches(card1, card2)) {
                  setCards(cards => {
                    cards
                    ->flipCard(card1.cardIndex, card1)
                    ->flipCard(card2.cardIndex, card2)
                  });
                  setSelections(_ => NoSelection);
                }
              | _ => ()
              }
            },
            3000,
          );
        Some(() => Js.Global.clearTimeout(timeOut));
      },
      [|selections|],
    );

    /* TODO:
          - Make it not match previously matched cards with new cards
          - Make it immediately flip two unmatched cards when you click
            a new one
       */
    let onClick = (i, _) => {
      switch (selections) {
      | Second(card1, card2) =>
        if (matches(card1, card2)) {
          setCards(cards => {cards->setMatched(card1)->setMatched(card2)});
          setSelections(_ => NoSelection);
        }
      | First(_) =>
        switch (cards[i]) {
        | Some(card2) =>
          setCards(cards => flipCard(cards, i, card2));
          setSelections(addSelection(card2));
        | None =>
          setCards(cards => cards);
          setSelections(selections => selections);
        }
      | _ =>
        switch (cards[i]) {
        | Some(card) =>
          setCards(cards => flipCard(cards, i, card));
          setSelections(addSelection(card));

        | None =>
          setCards(cards => cards);
          setSelections(selections => selections);
        }
      };
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
             cardState={card.cardState}
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
