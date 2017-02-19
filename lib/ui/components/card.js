'use strict';

const React = require('react');

const ui = require('../../ui');
const Draggable = ui.components.Draggable;

class Card extends Draggable {
  render() {
    const props = this.props;
    const isOpen = !props.forceDown && props.value !== null;

    let content;
    if (isOpen) {
      const suit = this.getSuit(props.card.value);
      content = <span>
        {props.value}
        <span className="suit">{this.getSuit(props.card.value)}</span>
        <span className="number">{this.getNumber(props.card.value)}</span>
      </span>;
    }

    const className =
        `card ${isOpen ? 'card-face-up' : 'card-face-down'}`;

    return <article className={className}
                    data-id={props.card.id}
                    draggable={this.props.draggable}
                    onDragStart={(e) => this.onDragStart(e)}>
      {content}
    </article>;
  }

  getSuit(value) {
    const suit = value % 4;
    switch (suit) {
      case 0:
        return '♠️';
      case 1:
        return '❤️';
      case 2:
        return '♦️';
      case 3:
        return '♣️';
      default:
        return '';
    }
  }

  getNumber(value) {
    const delta = (52 - this.props.cardCount) / 4;
    const number = delta + Math.floor(value / 4);
    switch (number) {
      case 9:
        return 'J';
      case 10:
        return 'Q';
      case 11:
        return 'K';
      case 12:
        return 'A';
      default:
        return (number + 2).toString();
    }
  }

  serializeDraggable() {
    const card = this.props.card;
    return { type: 'card', id: card.id, index: card.index, value: card.value };
  }
}
module.exports = Card;
