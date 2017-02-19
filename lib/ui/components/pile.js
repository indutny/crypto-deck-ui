'use strict';

const React = require('react');

const ui = require('../../ui');
const DropTarget = ui.components.DropTarget;

class Pile extends DropTarget {
  render() {
    return <section id="pile"
                    onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => this.onDrop(e)}>
      pile
    </section>;
  }

  handleDrop(data) {
    if (data.type === 'card')
      return this.props.onCardDrop(data);
  }
}
module.exports = Pile;
