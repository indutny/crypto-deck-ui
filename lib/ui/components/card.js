'use strict';

const React = require('react');

const ui = require('../../ui');
const Draggable = ui.components.Draggable;

class Card extends Draggable {
  render() {
    const props = this.props;

    let content;
    if (props.card.value !== null) {
      const suit = this.getSuit(props.card.value);
      content = <span>
        {props.value}
        <span className="suit">{this.getSuit(props.card.value)}</span>
        <span className="number">{this.getNumber(props.card.value)}</span>
      </span>;
    }

    const className =
        `card ${props.value === null ? 'card-face-down' : 'card-face-up'}`;

    return <article className={className}
                    draggable="true"
                    onDragStart={(e) => this.onDragStart(e)}
                    data-id={props.card.id}>
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
    const number = Math.floor(value / 4);
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
    return { type: 'card', id: this.props.card.id };
  }
}
module.exports = Card;
