'use strict';

const uuid = require('uuid/v4');

exports.preallocateCard = (owner) => {
  return {
    type: 'PREALLOCATE_CARD',
    payload: {
      id: uuid(),
      owner
    }
  };
};

exports.updateCard = (card) => {
  return {
    type: 'UPDATE_CARD',
    payload: {
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