'use strict';

const React = require('react');

const ui = require('../../ui');
const Card = ui.components.Card;

class Community extends React.Component {
  render() {
    return <section id="community">
      {
        this.props.cards.map((card) => {
          return <Card key={card.id} card={card} />;
        })
      }
    </section>;
  }
}
module.exports = Community;
