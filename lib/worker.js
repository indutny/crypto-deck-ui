'use strict';

const cryptoDeck = require('crypto-deck');

const elliptic = require('elliptic');
const brorand = require('brorand');
const Controller = require('./worker/deck-controller');

function State(options) {
  this.controller = new Controller({
    cardCount: options.cardCount
  });

  let hasEntropy = false;
  try {
    brorand(1);
    hasEntropy = true;
  } catch (e) {
  }

  this.deck = cryptoDeck.create({
    index: options.index,
    playerCount: options.playerCount,
    cardCount: options.cardCount,
    curve: elliptic.curves.secp256k1.curve,
    entropy: hasEntropy ? null : options.entropy,
    controller: this.controller
  });

  // Protocol events

  this.deck.once('ready', () => {
    postMessage({ type: 'ready', payload: null });
  });
  this.deck.on('message', (msg, target) => {
    const payload = { message: msg, target: target };
    postMessage({ type: 'message', payload: payload });
  });
  this.deck.on('error', (err) => {
    postMessage({ type: 'error', payload: err.message });
  });

  // Controller events

  this.controller.on('update', (data) => {
    postMessage({ type: 'update', payload: data });
  });
}

State.prototype.draw = function draw() {
  this.deck.draw((err, card) => {
    if (err)
      return postMessage({ type: 'error', payload: err.message });
    postMessage({ type: 'draw:complete', payload: card });
  });
};

State.prototype.open = function open(index) {
  this.deck.open(index, (err, card) => {
    if (err)
      return postMessage({ type: 'error', payload: err.message });
    postMessage({ type: 'open:complete', payload: card });
  });
};

State.prototype.update = function update(msg) {
  this.deck.update(msg, (err) => {
    if (err)
      return postMessage({ type: 'error', payload: err.message });
    postMessage({ type: 'update:complete' });
  });
};

State.prototype.receive = function receive(msg) {
  this.deck.receive(msg.data, msg.from);
};

let state = null;

onmessage = function onmessage(e) {
  const msg = e.data;

  if (msg.type === 'init') {
    state = new State(msg.payload);
  } else if (msg.type === 'start') {
    state.deck.start();
  } else if (msg.type === 'open') {
    state.open(msg.payload);
  } else if (msg.type === 'draw') {
    state.draw(msg.payload);
  } else if (msg.type === 'update') {
    state.update(msg.payload);
  } else if (msg.type === 'receive') {
    state.receive(msg.payload);
  }
};
