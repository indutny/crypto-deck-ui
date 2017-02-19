'use strict';

const redux = require('redux');

function card(state, action) {
  const p = action.payload;

  switch (action.type) {
    case 'UPDATE_CARD':
      if (!state) {
        return Object.assign({}, {
          id: p.id,
          open: p.open,
          owner: p.owner,
          value: p.value
        });
      }

      if (p.id !== state.id)
        return state;

      return Object.assign({}, state, {
        open: p.open,
        owner: p.owner,
        value: p.value
      });
    default:
      return state;
  }
}

function cards(state = [], action) {
  switch (action.type) {
    case 'UPDATE_CARD':
      const res = [];
      let i;
      for (i = 0; i < state.length; i++) {
        const original = state[i];
        const modified = card(state[i], action);
        res.push(modified);
        if (original !== modified)
          break;
      }
      if (i !== state.length)
        return res;

      return res.concat(card(undefined, action));
    default:
      return state;
  }
}

function ready(state = false, action) {
  switch (action.type) {
    case 'READY':
      return true;
    default:
      return state;
  }
}

module.exports = redux.combineReducers({
  ready,
  cards
});
