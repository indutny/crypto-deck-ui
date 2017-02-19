'use strict';

const redux = require('redux');

function card(state, action) {
  const p = action.payload;

  switch (action.type) {
    case 'PREALLOCATE_CARD':
      if (state)
        return state;
      return {
        id: p.id,
        index: null,
        owner: p.owner,
        value: null
      };
    case 'UPDATE_CARD':
      if (!state) {
        return Object.assign({}, {
          id: p.index,
          index: p.index,
          owner: p.owner,
          value: p.value
        });
      }

      // Three cases:
      //   1. Pre-allocated card has `null` index: match it by `owner` value
      //   2. Normal card - match by `index`
      let match;
      if (state.index === null)
        match = p.owner === state.owner;
      else
        match = p.index === state.index;
      if (!match)
        return state;

      return Object.assign({}, state, {
        index: p.index,
        owner: p.owner,
        value: p.value
      });
    default:
      return state;
  }
}

function cards(state = [], action) {
  switch (action.type) {
    case 'PREALLOCATE_CARD':
    case 'UPDATE_CARD':
      let found = false;
      const res = state.map((state) => {
        if (found)
          return state;

        const modified = card(state, action);
        if (modified !== state)
          found = true;
        return modified;
      });

      if (found)
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

function players(state = { list: [], index: null }, action) {
  const p = action.payload;
  switch (action.type) {
    case 'ADD_PLAYER':
      {
        const r = state.list.slice();
        r[p.index] = p.id;
        return Object.assign({}, state, { list: r });
      }
    case 'REMOVE_PLAYER':
      {
        const r = state.list.slice();
        r[p.index] = null;
        return Object.assign({}, state, { list: r });
      }
    case 'SET_SELF_INDEX':
      return Object.assign({}, state, { index: p.index });
    default:
      return state;
  }
}

module.exports = redux.combineReducers({
  ready,
  players,
  cards
});