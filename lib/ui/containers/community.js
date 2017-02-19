'use strict';

const ReactRedux = require('react-redux');

const ui = require('../../ui');

const mapStateToProps = (state, ownProps) => {
  const cards = state.cards.filter(card => card.owner === null);
  return Object.assign({
    cards: cards
  }, ownProps);
};

module.exports = ReactRedux.connect(mapStateToProps)(ui.components.Community);
