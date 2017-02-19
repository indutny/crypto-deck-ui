'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

exports.reducers = require('./ui/reducers');

const components = {};
const containers = {};
exports.components = components;
exports.containers = containers;

components.Draggable = require('./ui/components/draggable');

components.Card = require('./ui/components/card');

components.Player = require('./ui/components/player');
containers.Player = require('./ui/containers/player');

components.Community = require('./ui/components/community');
containers.Community = require('./ui/containers/community');

components.Deck = require('./ui/components/deck');

components.Board = require('./ui/components/board');
containers.Board = require('./ui/containers/board');

components.App = require('./ui/components/app');

ReactDOM.render(<components.App/>, document.getElementById('root'));
