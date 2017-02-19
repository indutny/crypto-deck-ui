'use strict';

const React = require('react');

const ui = require('../../ui');
const Card = ui.components.Card;
const DropTarget = ui.components.DropTarget;

class Community extends DropTarget {
  render() {
    return <section id="community"
                    onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => this.onDrop(e)}>
      {
        this.props.cards.map((card) => {
          return <Card key={card.id}
                       card={card}
                       forceDown={false}
                       draggable={true}/>;
        })
      }
    </section>;
  }

  handleDrop(data) {
    if (data.type === 'deck')
      return this.props.onDeckDrop(data);
    else if (data.type === 'card')
      return this.props.onCardDrop(data);
  }
}
module.exports = Community;