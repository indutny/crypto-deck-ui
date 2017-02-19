'use strict';

const React = require('react');

class DropTarget extends React.Component {
  onDragOver(e) {
    if (this.canDrop())
      e.preventDefault();
  }

  onDrop(e) {
    e.preventDefault();

    let data;
    try {
      data = JSON.parse(e.dataTransfer.getData('text'));
    } catch (e) {
      return;
    }

    this.handleDrop(data);
  }

  canDrop() {
    return true;
  }
}
module.exports = DropTarget;
