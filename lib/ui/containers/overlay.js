'use strict';

const ReactRedux = require('react-redux');

const ui = require('../../ui');

const mapStateToProps = (state, ownProps) => {
  return Object.assign({
    isVisible: !state.ready
  }, ownProps);
};

module.exports = ReactRedux.connect(mapStateToProps)(ui.components.Overlay);
