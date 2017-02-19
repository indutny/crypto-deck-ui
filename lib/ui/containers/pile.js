'use strict';

const ReactRedux = require('react-redux');

const ui = require('../../ui');
const actions = ui.redux.actions;

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps);
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCardDrop: (card) => {
      // Pre-allocated cards have to wait
      if (card.index === null)
        return;

      dispatch(actions.updateCard({
        index: card.index,
        owner: ui.PILE_OWNER,
        value: null
      }));
    }
  };
};

module.exports = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ui.components.Pile);
