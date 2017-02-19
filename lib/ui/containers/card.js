'use strict';

const ReactRedux = require('react-redux');

const ui = require('../../ui');
const actions = ui.redux.actions;

const mapStateToProps = (state, ownProps) => {
  return Object.assign({
    cardCount: state.cardCount
  }, ownProps);
};

module.exports = ReactRedux.connect(
  mapStateToProps
)(ui.components.Card);
