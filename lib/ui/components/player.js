'use strict';

const React = require('react');

const ui = require('../../ui');
const Card = ui.components.Card;

class Player extends React.Component {
  render() {
    const className = `player ${this.props.self ? 'player-self' : ''}`;
    return <section className={className} data-index={this.props.index}>
      {
        this.props.cards.map((card) => {
          return <Card key={card.id} card={card} />;
        })
      }
    </section>;
  }
}
module.exports = Player;
