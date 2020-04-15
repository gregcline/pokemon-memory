'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Js_math = require("bs-platform/lib/js/js_math.js");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");

function Game$Card(Props) {
  var imageId = Props.imageId;
  var faceUp = Props.faceUp;
  var onClick = Props.onClick;
  return React.createElement("div", {
              className: "card",
              style: {
                backgroundColor: "#333",
                borderRadius: "0.5rem"
              },
              onClick: onClick
            }, React.createElement("img", {
                  style: {
                    display: "block",
                    margin: "auto",
                    opacity: faceUp ? "1" : "0"
                  },
                  src: "./static/" + (String(imageId) + ".png")
                }));
}

var Card = {
  make: Game$Card
};

function Game$Cards(Props) {
  var flipCard = function (i, card, cards) {
    var newCards = cards.slice(0);
    Belt_Array.setExn(newCards, i, {
          cardIndex: card.cardIndex,
          imageId: card.imageId,
          cardState: !card.cardState
        });
    return newCards;
  };
  var match = React.useState((function () {
          var half = Belt_Array.makeBy(10, (function (param) {
                  return Js_math.random_int(1, 152);
                }));
          var full = Belt_Array.concat(half, half);
          return Belt_Array.mapWithIndex(Belt_Array.shuffle(Belt_Array.map(full, (function (imageId) {
                                return {
                                        cardIndex: 0,
                                        imageId: imageId,
                                        cardState: false
                                      };
                              }))), (function (cardIndex, card) {
                        return {
                                cardIndex: cardIndex,
                                imageId: card.imageId,
                                cardState: card.cardState
                              };
                      }));
        }));
  var setCards = match[1];
  var cards = match[0];
  var match$1 = React.useState((function () {
          return /* NoSelection */0;
        }));
  var setSelections = match$1[1];
  var selections = match$1[0];
  React.useEffect((function () {
          var timeOut = setTimeout((function (param) {
                  if (typeof selections === "number" || !selections.tag) {
                    return /* () */0;
                  } else {
                    var card2 = selections[1];
                    var card1 = selections[0];
                    Curry._1(setCards, (function (cards) {
                            var flip1 = flipCard(card1.cardIndex, card1, cards);
                            return flipCard(card2.cardIndex, card2, flip1);
                          }));
                    return Curry._1(setSelections, (function (param) {
                                  return /* NoSelection */0;
                                }));
                  }
                }), 4000);
          return (function (param) {
                    clearTimeout(timeOut);
                    return /* () */0;
                  });
        }), [selections]);
  return React.createElement("div", {
              style: {
                display: "grid",
                gridGap: "0.5rem",
                gridTemplateColumns: "repeat(5, 18%)",
                gridTemplateRows: "repeat(4, 18%)"
              }
            }, Belt_Array.mapWithIndex(cards, (function (i, card) {
                    return React.createElement(Game$Card, {
                                imageId: card.imageId,
                                faceUp: card.cardState,
                                onClick: (function (param) {
                                    var i$1 = i;
                                    if (typeof selections !== "number" && selections.tag) {
                                      return /* () */0;
                                    }
                                    var match = Belt_Array.get(cards, i$1);
                                    if (match !== undefined) {
                                      var card = match;
                                      Curry._1(setCards, (function (param) {
                                              return flipCard(i$1, card, param);
                                            }));
                                      return Curry._1(setSelections, (function (param) {
                                                    var card$1 = card;
                                                    var selections = param;
                                                    if (typeof selections === "number") {
                                                      return /* First */Block.__(0, [card$1]);
                                                    } else if (selections.tag) {
                                                      return selections;
                                                    } else {
                                                      return /* Second */Block.__(1, [
                                                                selections[0],
                                                                card$1
                                                              ]);
                                                    }
                                                  }));
                                    } else {
                                      Curry._1(setCards, (function (cards) {
                                              return cards;
                                            }));
                                      return Curry._1(setSelections, (function (selections) {
                                                    return selections;
                                                  }));
                                    }
                                  }),
                                key: String(i) + String(card.imageId)
                              });
                  })));
}

var Cards = {
  make: Game$Cards
};

function Game(Props) {
  return React.createElement("div", {
              style: {
                height: "900px",
                width: "900px"
              }
            }, React.createElement(Game$Cards, { }));
}

var make = Game;

exports.Card = Card;
exports.Cards = Cards;
exports.make = make;
/* react Not a pure module */
