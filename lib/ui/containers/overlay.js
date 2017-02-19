'use strict';

const ReactRedux = require('react-redux');

const ui = require('../../ui');

const mapStateToProps = (state, ownProps) => {
  return Object.assign({
    isVisible: state.stage !== 'ready',
    playerCount: state.players.list.length,
    stage: state.stage
  }, ownProps);
};

module.exports = ReactRedux.connect(mapStateToProps)(ui.components.Overlay);
