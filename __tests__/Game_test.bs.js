'use strict';

var Jest = require("@glennsl/bs-jest/src/jest.js");
var Game$ReasonReactExamples = require("../src/Game.bs.js");

Jest.describe("Game", (function (param) {
        Jest.describe("nextPlayer", (function (param) {
                Jest.test("returns Player1 for Player2", (function (param) {
                        return Jest.Expect.toEqual(/* Player1 */0, Jest.Expect.expect(Game$ReasonReactExamples.nextPlayer(/* Player2 */1)));
                      }));
                return Jest.test("returns Player2 for Player1", (function (param) {
                              return Jest.Expect.toEqual(/* Player2 */1, Jest.Expect.expect(Game$ReasonReactExamples.nextPlayer(/* Player1 */0)));
                            }));
              }));
        return Jest.describe("showPlayer", (function (param) {
                      Jest.test("shows 'Player 1' for Player1", (function (param) {
                              return Jest.Expect.toEqual("Player 1", Jest.Expect.expect(Game$ReasonReactExamples.showPlayer(/* Player1 */0)));
                            }));
                      return Jest.test("shows 'Player 2' for Player2", (function (param) {
                                    return Jest.Expect.toEqual("Player 2", Jest.Expect.expect(Game$ReasonReactExamples.showPlayer(/* Player2 */1)));
                                  }));
                    }));
      }));

/*  Not a pure module */
