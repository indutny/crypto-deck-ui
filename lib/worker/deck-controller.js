'use strict';

const assert = require('minimalistic-assert');
const inherits = require('inherits');

const EventEmitter = require('events').EventEmitter;

function Card() {
  this.owner = null;
  this.value = null;
  this.open = false;
}

function Controller(options) {
  EventEmitter.call(this);

  this.options = options;
  assert.equal(typeof this.options.cardCount, 'number',
               'options.cardCount is required (number)');

  this.cards = new Array(this.options.cardCount);
  for (let i = 0; i < this.cards.length; i++)
    this.cards[i] = new Card();
}
inherits(Controller, EventEmitter);
module.exports = Controller;


//
// Hooks
//

Controller.prototype.validateUpdate = function validateUpdate(msg, from) {
  throw new Error('Not supported');
};

Controller.prototype.update = function update(msg, from) {
};

Controller.prototype.validateDraw = function validateDraw(player, index) {
  const card = this.cards[index];
  if (card.owner !== null)
    throw new Error('Can\'t draw other\'s card');
  if (card.open)
    throw new Error('Can\'t draw open card');
  card.owner = player;
};

// NOTE: `value` may be `null`
Controller.prototype.draw = function draw(player, index, value) {
  const card = this.cards[index];
  card.value = value;

  this.emit('update', { index: index, card: card });
};

Controller.prototype.validateOpen = function validateOpen(player, index) {
  const card = this.cards[index];
  if (card.owner !== player && card.owner !== null)
    throw new Error('Can\'t open other\'s card');
  if (card.open)
    throw new Error('Can\'t open alreday open card');
  card.open = true;
};

Controller.prototype.open = function open(player, index, value) {
  const card = this.cards[index];
  card.value = value;

  this.emit('update', { index: index, card: card });
};
