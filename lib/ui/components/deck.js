'use strict';

const React = require('react');

const ui = require('../../ui');
const Draggable = ui.components.Draggable;

class Deck extends Draggable {
  render() {
    return <article id="deck"
                    draggable={true}
                    onDragStart={(e) => this.onDragStart(e)}>
      deck
    </article>;
  }

  serializeDraggable() {
    return { type: 'deck' };
  }
}
module.exports = Deck;
