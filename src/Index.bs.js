'use strict';

var React = require("react");
var ReactDOMRe = require("reason-react/src/ReactDOMRe.js");
var Game$ReasonReactExamples = require("./Game.bs.js");

ReactDOMRe.renderToElementWithId(React.createElement(Game$ReasonReactExamples.make, { }), "game");

/*  Not a pure module */
