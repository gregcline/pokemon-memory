'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Cards$ReasonReactExamples = require("./Cards.bs.js");

function nextPlayer(player) {
  if (player) {
    return /* Player1 */0;
  } else {
    return /* Player2 */1;
  }
}

function showPlayer(player) {
  if (player) {
    return "Player 2";
  } else {
    return "Player 1";
  }
}

function Game(Props) {
  var match = React.useState((function () {
          return /* Player1 */0;
        }));
  var setPlayer = match[1];
  var changePlayer = function (param) {
    return Curry._1(setPlayer, nextPlayer);
  };
  return React.createElement("div", undefined, React.createElement("p", undefined, "Player: " + (
                  match[0] ? "Player 2" : "Player 1"
                )), React.createElement("div", {
                  style: {
                    height: "900px",
                    width: "900px"
                  }
                }, React.createElement(Cards$ReasonReactExamples.make, {
                      changePlayer: changePlayer
                    })));
}

var make = Game;

exports.nextPlayer = nextPlayer;
exports.showPlayer = showPlayer;
exports.make = make;
/* react Not a pure module */
