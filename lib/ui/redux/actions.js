'use strict';

const uuid = require('uuid/v4');

exports.reset = () => {
  return { type: 'RESET' };
};

exports.setCardCount = (count) => {
  return { type: 'SET_CARD_COUNT', payload: count };
};

exports.preallocateCard = (owner) => {
  return {
    type: 'PREALLOCATE_CARD',
    payload: {
      id: uuid(),
      // Put pre-allocated cards to the very right
      changedAt: Infinity,
      owner
    }
  };
};

exports.updateCard = (card) => {
  return {
    type: 'UPDATE_CARD',
    payload: {
      changedAt: Date.now(),
      remote: card.remote,
      index: card.index,
      owner: card.owner,
      value: card.value
    }
  };
};

exports.ready = () => {
  return { type: 'READY' };
};

exports.addPlayer = (index, id) => {
  return { type: 'ADD_PLAYER', payload: { index, id } };
};

exports.removePlayer = (index) => {
  return { type: 'REMOVE_PLAYER', payload: { index } };
};

exports.setSelfIndex = (index) => {
  return { type: 'SET_SELF_INDEX', payload: { index } };
};
