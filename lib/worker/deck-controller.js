'use strict';

const assert = require('minimalistic-assert');
const inherits = require('inherits');

const EventEmitter = require('events').EventEmitter;

function Card() {
  this.owner = null;
  this.value = null;
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
  assert.equal(typeof msg.type, 'string', 'update message must have type');
  const type = msg.type;
  const payload = msg.payload;
  if (type === 'changeOwner') {
    assert(payload, 'changeOwner must have payload');
    assert.equal(typeof payload, 'object',
                 'changeOwner payload must be an object');
    assert.equal(typeof payload.index, 'number',
                 'changeOwner payload must have `index`');
    assert.equal(typeof payload.owner, 'number',
                 'changeOwner payload must have `owner`');

    const card = this.cards[payload.index];
    if (card.owner !== null && card.owner !== from)
      throw new Error('Can\'t change owner of other\'s card');

    return;
  }

  throw new Error('Update type not supported: ' + type);
};

Controller.prototype.update = function update(msg, from) {
  const type = msg.type;
  const payload = msg.payload;

  if (type === 'changeOwner') {
    const card = this.cards[payload.index];
    card.owner = payload.owner;
    this.emit('update', { index: payload.index, card });
  }
};

Controller.prototype.validateDraw = function validateDraw(player, index) {
  const card = this.cards[index];
  if (card.owner !== null)
    throw new Error('Can\'t draw other\'s card');
  card.owner = player;
};

// NOTE: `value` may be `null`
Controller.prototype.draw = function draw(player, index, value) {
  const card = this.cards[index];
  card.value = value;

  this.emit('update', { index, card });
};

Controller.prototype.validateOpen = function validateOpen(player, index) {
  const card = this.cards[index];
  if (card.owner !== player && card.owner !== null)
    throw new Error('Can\'t open other\'s card');
};

Controller.prototype.open = function open(player, index, value) {
  const card = this.cards[index];
  card.owner = null;
  card.value = value;

  this.emit('update', { index, card });
};
