'use strict';

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
  var match = React.useState((function () {
          var half = Belt_Array.makeBy(10, (function (param) {
                  return Js_math.random_int(1, 152);
                }));
          var full = Belt_Array.concat(half, half);
          return Belt_Array.shuffle(Belt_Array.map(full, (function (imageId) {
                            return {
                                    imageId: imageId,
                                    cardState: false
                                  };
                          })));
        }));
  var setCards = match[1];
  return React.createElement("div", {
              style: {
                display: "grid",
                gridGap: "0.5rem",
                gridTemplateColumns: "repeat(5, 18%)",
                gridTemplateRows: "repeat(4, 18%)"
              }
            }, Belt_Array.mapWithIndex(match[0], (function (i, card) {
                    return React.createElement(Game$Card, {
                                imageId: card.imageId,
                                faceUp: card.cardState,
                                onClick: (function (param) {
                                    var i$1 = i;
                                    return Curry._1(setCards, (function (cards) {
                                                  var match = Belt_Array.get(cards, i$1);
                                                  if (match !== undefined) {
                                                    var newCards = cards.slice(0);
                                                    Belt_Array.setExn(newCards, i$1, {
                                                          imageId: match.imageId,
                                                          cardState: true
                                                        });
                                                    return newCards;
                                                  } else {
                                                    return cards;
                                                  }
                                                }));
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
