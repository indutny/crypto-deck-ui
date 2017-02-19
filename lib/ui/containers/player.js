'use strict';

const ReactRedux = require('react-redux');

const ui = require('../../ui');
const actions = ui.redux.actions;

const mapStateToProps = (state, ownProps) => {
  const isSelf = state.players.index === ownProps.index;
  const cards = state.cards.filter(card => card.owner === ownProps.index);
  cards.sort((a, b) => {
    return a.changedAt - b.changedAt;
  });
  return Object.assign({
    isSelf: isSelf,
    cards: cards
  }, ownProps);
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onDeckDrop: () => {
      dispatch(actions.preallocateCard(ownProps.index))
    },
    onCardDrop: (card) => {
      dispatch(actions.updateCard({
        remote: false,
        index: card.index,
        owner: ownProps.index,
        value: card.value
      }));
    }
  };
};

module.exports = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ui.components.Player);
