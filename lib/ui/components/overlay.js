'use strict';

const React = require('react');

const ui = require('../../ui');

class Overlay extends React.Component {
  render() {
    const props = this.props;
    const className = props.isVisible ? 'overlay-visible' : 'overlay-hidden';
    let text;
    if (props.stage === 'init')
      text = `Waiting for players to join the game [${props.playerCount}/2]...`;
    else if (props.stage === 'starting')
      text = 'Collecting secure data...';
    else
      text = 'Ready';
    return <section id="overlay" className={className}>
      {text}
    </section>;
  }
}
module.exports = Overlay;
