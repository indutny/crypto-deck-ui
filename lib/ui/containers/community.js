'use strict';

const ReactRedux = require('react-redux');

const ui = require('../../ui');
const actions = ui.redux.actions;

const mapStateToProps = (state, ownProps) => {
  const cards = state.cards.filter(card => card.owner === null);
  cards.sort((a, b) => {
    return a.changedAt - b.changedAt;
  });
  return Object.assign({
    cards: cards
  }, ownProps);
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onDeckDrop: () => {
      dispatch(actions.preallocateCard(null))
    },
    onCardDrop: (card) => {
      dispatch(actions.updateCard({
        remote: false,
        index: card.index,
        owner: null,
        value: card.value
      }));
    }
  };
};

module.exports = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ui.components.Community);
