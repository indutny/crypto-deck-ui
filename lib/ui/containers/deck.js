'use strict';

const ReactRedux = require('react-redux');

const ui = require('../../ui');
const actions = ui.redux.actions;

const mapStateToProps = (state, ownProps) => {
  return Object.assign({
    isEmpty: state.cardCount === state.cards.length
  }, ownProps);
};

module.exports = ReactRedux.connect(
  mapStateToProps
)(ui.components.Deck);
