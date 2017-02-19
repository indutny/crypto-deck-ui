'use strict';

const React = require('react');

const ui = require('../../ui');
const Draggable = ui.components.Draggable;

class Deck extends Draggable {
  render() {
    const isEmpty = this.props.isEmpty;
    return <article id="deck"
                    draggable={!isEmpty}
                    onDragStart={(e) => this.onDragStart(e)}>
      {isEmpty ? '0' : 'deck'}
    </article>;
  }

  serializeDraggable() {
    return { type: 'deck' };
  }
}
module.exports = Deck;
