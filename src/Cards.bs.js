'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Js_math = require("bs-platform/lib/js/js_math.js");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");

function Cards$Card(Props) {
  var imageId = Props.imageId;
  var cardState = Props.cardState;
  var onClick = Props.onClick;
  var cardOpacity;
  switch (cardState) {
    case /* FaceDown */0 :
        cardOpacity = "0";
        break;
    case /* FaceUp */1 :
        cardOpacity = "1";
        break;
    case /* Matched */2 :
        cardOpacity = "0.5";
        break;
    
  }
  return React.createElement("div", {
              className: "card",
              style: {
                backgroundColor: "#333",
                borderRadius: "0.5rem"
              },
              onClick: cardState !== /* Matched */2 ? onClick : (function (param) {
                    return /* () */0;
                  })
            }, cardState === /* Matched */2 ? React.createElement("div", {
                    style: {
                      color: "#BBB",
                      padding: "1em",
                      position: "absolute"
                    }
                  }, "✓") : null, React.createElement("img", {
                  style: {
                    display: "block",
                    margin: "auto",
                    opacity: cardOpacity
                  },
                  src: "./static/" + (String(imageId) + ".png")
                }));
}

var Card = {
  make: Cards$Card
};

function matches(card1, card2) {
  if (card1.imageId === card2.imageId && card1.cardState !== /* Matched */2) {
    return card2.cardState !== /* Matched */2;
  } else {
    return false;
  }
}

function switchState(state) {
  switch (state) {
    case /* FaceDown */0 :
        return /* FaceUp */1;
    case /* FaceUp */1 :
        return /* FaceDown */0;
    case /* Matched */2 :
        return /* Matched */2;
    
  }
}

function flipCard(cards, i, card) {
  var newCards = cards.slice(0);
  var newState = switchState(card.cardState);
  Belt_Array.setExn(newCards, i, {
        cardIndex: card.cardIndex,
        imageId: card.imageId,
        cardState: newState
      });
  return newCards;
}

function setMatched(cards, card) {
  var newCards = cards.slice(0);
  Belt_Array.setExn(newCards, card.cardIndex, {
        cardIndex: card.cardIndex,
        imageId: card.imageId,
        cardState: /* Matched */2
      });
  return newCards;
}

function addSelection(card, selections) {
  if (typeof selections === "number") {
    return /* First */Block.__(0, [{
                cardIndex: card.cardIndex,
                imageId: card.imageId,
                cardState: switchState(card.cardState)
              }]);
  } else if (selections.tag) {
    return selections;
  } else {
    return /* Second */Block.__(1, [
              selections[0],
              {
                cardIndex: card.cardIndex,
                imageId: card.imageId,
                cardState: switchState(card.cardState)
              }
            ]);
  }
}

function Cards(Props) {
  var changePlayer = Props.changePlayer;
  var match = React.useState((function () {
          var half = Belt_Array.makeBy(10, (function (param) {
                  return Js_math.random_int(1, 152);
                }));
          var full = Belt_Array.concat(half, half);
          return Belt_Array.mapWithIndex(Belt_Array.shuffle(Belt_Array.map(full, (function (imageId) {
                                return {
                                        cardIndex: 0,
                                        imageId: imageId,
                                        cardState: /* FaceDown */0
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
                    if (matches(card1, card2)) {
                      return 0;
                    } else {
                      Curry._1(setCards, (function (param) {
                              return flipCard(flipCard(cards, card1.cardIndex, card1), card2.cardIndex, card2);
                            }));
                      Curry._1(setSelections, (function (param) {
                              return /* NoSelection */0;
                            }));
                      return Curry._1(changePlayer, /* () */0);
                    }
                  }
                }), 3000);
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
                    return React.createElement(Cards$Card, {
                                imageId: card.imageId,
                                cardState: card.cardState,
                                onClick: (function (param) {
                                    var i$1 = i;
                                    if (typeof selections === "number") {
                                      var match = Belt_Array.get(cards, i$1);
                                      if (match !== undefined) {
                                        var card = match;
                                        Curry._1(setCards, (function (cards) {
                                                return flipCard(cards, i$1, card);
                                              }));
                                        return Curry._1(setSelections, (function (param) {
                                                      return addSelection(card, param);
                                                    }));
                                      } else {
                                        Curry._1(setCards, (function (cards) {
                                                return cards;
                                              }));
                                        return Curry._1(setSelections, (function (selections) {
                                                      return selections;
                                                    }));
                                      }
                                    } else if (selections.tag) {
                                      var card2 = selections[1];
                                      var card1 = selections[0];
                                      if (matches(card1, card2)) {
                                        Curry._1(setCards, (function (cards) {
                                                return setMatched(setMatched(cards, card1), card2);
                                              }));
                                        return Curry._1(setSelections, (function (param) {
                                                      return /* NoSelection */0;
                                                    }));
                                      } else {
                                        Curry._1(setCards, (function (param) {
                                                return flipCard(flipCard(cards, card1.cardIndex, card1), card2.cardIndex, card2);
                                              }));
                                        Curry._1(setSelections, (function (param) {
                                                return /* NoSelection */0;
                                              }));
                                        return Curry._1(changePlayer, /* () */0);
                                      }
                                    } else {
                                      var card1$1 = selections[0];
                                      var match$1 = Belt_Array.get(cards, i$1);
                                      if (match$1 !== undefined) {
                                        var card2$1 = match$1;
                                        if (matches(card1$1, card2$1)) {
                                          Curry._1(setCards, (function (cards) {
                                                  return setMatched(setMatched(cards, card1$1), card2$1);
                                                }));
                                          return Curry._1(setSelections, (function (param) {
                                                        return /* NoSelection */0;
                                                      }));
                                        } else {
                                          Curry._1(setCards, (function (cards) {
                                                  return flipCard(cards, i$1, card2$1);
                                                }));
                                          return Curry._1(setSelections, (function (param) {
                                                        return addSelection(card2$1, param);
                                                      }));
                                        }
                                      } else {
                                        Curry._1(setCards, (function (cards) {
                                                return cards;
                                              }));
                                        return Curry._1(setSelections, (function (selections) {
                                                      return selections;
                                                    }));
                                      }
                                    }
                                  }),
                                key: String(i) + String(card.imageId)
                              });
                  })));
}

var make = Cards;

exports.Card = Card;
exports.matches = matches;
exports.switchState = switchState;
exports.flipCard = flipCard;
exports.setMatched = setMatched;
exports.addSelection = addSelection;
exports.make = make;
/* react Not a pure module */
