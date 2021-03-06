'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

exports.PILE_OWNER = -1;

exports.redux = {};
exports.redux.reducers = require('./ui/redux/reducers');
exports.redux.actions = require('./ui/redux/actions');

const components = {};
const containers = {};
exports.components = components;
exports.containers = containers;

components.Draggable = require('./ui/components/draggable');
components.DropTarget = require('./ui/components/drop-target');

components.Card = require('./ui/components/card');
containers.Card = require('./ui/containers/card');

components.Player = require('./ui/components/player');
containers.Player = require('./ui/containers/player');

components.Community = require('./ui/components/community');
containers.Community = require('./ui/containers/community');

components.Deck = require('./ui/components/deck');
containers.Deck = require('./ui/containers/deck');

components.Pile = require('./ui/components/pile');
containers.Pile = require('./ui/containers/pile');

components.Board = require('./ui/components/board');
containers.Board = require('./ui/containers/board');

components.Overlay = require('./ui/components/overlay');
containers.Overlay = require('./ui/containers/overlay');

components.App = require('./ui/components/app');

ReactDOM.render(<components.App/>, document.getElementById('root'));
