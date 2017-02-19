'use strict';

const path = require('path');

const PUBLIC = path.join(__dirname, 'public');
const LIB = path.join(__dirname, 'lib');

const loaders = [
  { test: /\.js$/, loader: 'babel-loader' }
];

module.exports = [{
  entry: path.join(LIB, 'ui.js'),
  output: {
    path: path.join(PUBLIC, 'js'),
    filename: 'bundle.js'
  },
  module: {
    loaders: loaders
  }
}, {
  entry: path.join(LIB, 'worker.js'),
  output: {
    path: path.join(PUBLIC, 'js'),
    filename: 'worker.js'
  },
  module: {
    loaders: loaders
  }
}];
