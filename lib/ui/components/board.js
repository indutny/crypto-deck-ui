'use strict';

const React = require('react');

const ui = require('../../ui');

class Board extends React.Component {
  render() {
    return <section id="board">
      <ui.components.Deck />
      <ui.containers.Community />
      {
        this.props.players.map((p, i) => {
          return <ui.containers.Player key={i} index={i} />
        })
      }
    </section>;
  }
}
module.exports = Board;
