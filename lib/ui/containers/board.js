'use strict';

const ReactRedux = require('react-redux');

const ui = require('../../ui');

const mapStateToProps = (state, ownProps) => {
  return Object.assign({
    players: state.players
  }, ownProps);
};

module.exports = ReactRedux.connect(mapStateToProps)(ui.components.Board);
