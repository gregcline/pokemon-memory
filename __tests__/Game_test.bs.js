'use strict';

var Jest = require("@glennsl/bs-jest/src/jest.js");
var Block = require("bs-platform/lib/js/block.js");
var Game$ReasonReactExamples = require("../src/Game.bs.js");

Jest.describe("Cards", (function (param) {
        Jest.describe("matches", (function (param) {
                Jest.test("is true for two unmatched cards with the same id", (function (param) {
                        return Jest.Expect.toBe(true, Jest.Expect.expect(Game$ReasonReactExamples.Cards.matches({
                                            cardIndex: 0,
                                            imageId: 1,
                                            cardState: /* FaceUp */1
                                          }, {
                                            cardIndex: 1,
                                            imageId: 1,
                                            cardState: /* FaceUp */1
                                          })));
                      }));
                Jest.test("is false for two unmatched cards with different ids", (function (param) {
                        return Jest.Expect.toBe(false, Jest.Expect.expect(Game$ReasonReactExamples.Cards.matches({
                                            cardIndex: 0,
                                            imageId: 1,
                                            cardState: /* FaceUp */1
                                          }, {
                                            cardIndex: 1,
                                            imageId: 2,
                                            cardState: /* FaceUp */1
                                          })));
                      }));
                return Jest.test("is false for a matched card with the same ids", (function (param) {
                              var card1 = {
                                cardIndex: 0,
                                imageId: 1,
                                cardState: /* Matched */2
                              };
                              var card2 = {
                                cardIndex: 1,
                                imageId: 1,
                                cardState: /* FaceUp */1
                              };
                              Jest.Expect.toBe(false, Jest.Expect.expect(Game$ReasonReactExamples.Cards.matches(card1, card2)));
                              return Jest.Expect.toBe(false, Jest.Expect.expect(Game$ReasonReactExamples.Cards.matches(card2, card1)));
                            }));
              }));
        Jest.describe("flipCard", (function (param) {
                Jest.test("FaceDown goes to FaceUp", (function (param) {
                        var card = {
                          cardIndex: 0,
                          imageId: 1,
                          cardState: /* FaceDown */0
                        };
                        var cards = [card];
                        return Jest.Expect.toEqual([{
                                      cardIndex: 0,
                                      imageId: 1,
                                      cardState: /* FaceUp */1
                                    }], Jest.Expect.expect(Game$ReasonReactExamples.Cards.flipCard(cards, 0, card)));
                      }));
                Jest.test("FaceUp goes to FaceDown", (function (param) {
                        var card = {
                          cardIndex: 0,
                          imageId: 1,
                          cardState: /* FaceUp */1
                        };
                        var cards = [card];
                        return Jest.Expect.toEqual([{
                                      cardIndex: 0,
                                      imageId: 1,
                                      cardState: /* FaceDown */0
                                    }], Jest.Expect.expect(Game$ReasonReactExamples.Cards.flipCard(cards, 0, card)));
                      }));
                return Jest.test("Matched goes to Matched", (function (param) {
                              var card = {
                                cardIndex: 0,
                                imageId: 1,
                                cardState: /* Matched */2
                              };
                              var cards = [card];
                              return Jest.Expect.toEqual([{
                                            cardIndex: 0,
                                            imageId: 1,
                                            cardState: /* Matched */2
                                          }], Jest.Expect.expect(Game$ReasonReactExamples.Cards.flipCard(cards, 0, card)));
                            }));
              }));
        Jest.describe("setMatched", (function (param) {
                Jest.test("sets a FaceDown card as Matched", (function (param) {
                        var card = {
                          cardIndex: 0,
                          imageId: 1,
                          cardState: /* FaceDown */0
                        };
                        var cards = [card];
                        return Jest.Expect.toEqual([{
                                      cardIndex: 0,
                                      imageId: 1,
                                      cardState: /* Matched */2
                                    }], Jest.Expect.expect(Game$ReasonReactExamples.Cards.setMatched(cards, card)));
                      }));
                Jest.test("sets a FaceUp card as Matched", (function (param) {
                        var card = {
                          cardIndex: 0,
                          imageId: 1,
                          cardState: /* FaceUp */1
                        };
                        var cards = [card];
                        return Jest.Expect.toEqual([{
                                      cardIndex: 0,
                                      imageId: 1,
                                      cardState: /* Matched */2
                                    }], Jest.Expect.expect(Game$ReasonReactExamples.Cards.setMatched(cards, card)));
                      }));
                return Jest.test("sets a Matched card as Matched", (function (param) {
                              var card = {
                                cardIndex: 0,
                                imageId: 1,
                                cardState: /* Matched */2
                              };
                              var cards = [card];
                              return Jest.Expect.toEqual([{
                                            cardIndex: 0,
                                            imageId: 1,
                                            cardState: /* Matched */2
                                          }], Jest.Expect.expect(Game$ReasonReactExamples.Cards.setMatched(cards, card)));
                            }));
              }));
        return Jest.describe("addSelection", (function (param) {
                      Jest.test("NoSelection takes a card and becomes First(card)", (function (param) {
                              var card = {
                                cardIndex: 0,
                                imageId: 1,
                                cardState: /* FaceDown */0
                              };
                              return Jest.Expect.toEqual(/* First */Block.__(0, [card]), Jest.Expect.expect(Game$ReasonReactExamples.Cards.addSelection(card, /* NoSelection */0)));
                            }));
                      Jest.test("First(card1) takes a card and becomes Second(card1, card)", (function (param) {
                              var card = {
                                cardIndex: 0,
                                imageId: 1,
                                cardState: /* FaceDown */0
                              };
                              return Jest.Expect.toEqual(/* Second */Block.__(1, [
                                            card,
                                            card
                                          ]), Jest.Expect.expect(Game$ReasonReactExamples.Cards.addSelection(card, /* First */Block.__(0, [card]))));
                            }));
                      return Jest.test("Second(card1, card2) doesn't change", (function (param) {
                                    var card = {
                                      cardIndex: 0,
                                      imageId: 1,
                                      cardState: /* FaceDown */0
                                    };
                                    return Jest.Expect.toEqual(/* Second */Block.__(1, [
                                                  card,
                                                  card
                                                ]), Jest.Expect.expect(Game$ReasonReactExamples.Cards.addSelection({
                                                        cardIndex: 2,
                                                        imageId: 2,
                                                        cardState: /* FaceDown */0
                                                      }, /* Second */Block.__(1, [
                                                          card,
                                                          card
                                                        ]))));
                                  }));
                    }));
      }));

var Cards = /* alias */0;

exports.Cards = Cards;
/*  Not a pure module */
