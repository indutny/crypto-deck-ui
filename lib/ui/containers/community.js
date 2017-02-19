'use strict';

const ReactRedux = require('react-redux');

const ui = require('../../ui');
const actions = ui.redux.actions;

const mapStateToProps = (state, ownProps) => {
  const cards = state.cards.filter(card => card.owner === null);
  return Object.assign({
    cards: cards
  }, ownProps);
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onDeckDrop: () => {
      dispatch(actions.preallocateCard(null))
    },
    onCardDrop: () => {
    }
  };
};

module.exports = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ui.components.Community);