'use strict';

const React = require('React');

class Draggable extends React.Component {
  onDragStart(e) {
    e.dataTransfer.setData('text/plain',
                           JSON.stringify(this.serializeDraggable()));
  }
}
module.exports = Draggable;
