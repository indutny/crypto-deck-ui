'use strict';

const React = require('react');

class Draggable extends React.Component {
  onDragStart(e) {
    e.dataTransfer.setData('text',
                           JSON.stringify(this.serializeDraggable()));
  }
}
module.exports = Draggable;
