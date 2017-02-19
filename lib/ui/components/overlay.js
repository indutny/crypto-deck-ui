'use strict';

const React = require('react');

const ui = require('../../ui');

class Overlay extends React.Component {
  render() {
    const props = this.props;
    const className = props.isVisible ? 'overlay-visible' : 'overlay-hidden';
    return <section id="overlay" className={className}>
      Waiting for players to join the game...
    </section>;
  }
}
module.exports = Overlay;
