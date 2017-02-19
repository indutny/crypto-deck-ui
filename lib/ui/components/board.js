'use strict';

const React = require('react');

const ui = require('../../ui');

class Board extends React.Component {
  render() {
    const props = this.props;
    const index = props.players.index;
    return <section id="board">
      <ui.components.Deck />
      <ui.containers.Pile />
      <div className="clear" />
      <ui.containers.Community />
      {
        props.players.list.map((p, i) => {
          return <ui.containers.Player key={i} index={i} isSelf={i === index}/>
        })
      }
    </section>;
  }
}
module.exports = Board;
