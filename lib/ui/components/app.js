'use strict';

const redux = require('redux');
const React = require('react');
const Provider = require('react-redux').Provider;
const ioClient = require('socket.io-client');

const ui = require('../../ui');
const Board = ui.containers.Board;

const CARD_COUNT = 52;

class App extends React.Component {
  constructor() {
    super();

    this.room = document.location.hash.slice(1);
    if (!this.room) {
      for (let i = 0; i < 2; i++)
        this.room += Math.floor(Math.random() * 0xffffffff).toString(36);
      document.location.hash = this.room;
    }

    this.state = {
      index: null,
      players: []
    };

    this.store = redux.createStore(ui.reducers);
    this.worker = new Worker('/js/worker.js');
    this.io = ioClient();

    this.io.emit('join', this.room);

    this.handleIO();
    this.worker.onmessage = e => this.handleWorkerMsg(e.data);
  }

  handleIO() {
    this.io.on('join', ({ id, index }) => {
      const players = this.state.players.slice();
      players[index] = id;

      const newIndex = id === this.io.id ? index : this.state.index;

      this.setState(Object.assign({}, this.state, {
        players,
        index: newIndex
      }));
    });
    this.io.on('leave', ({ id, index }) => {
      const players = this.state.players.slice();
      players[index] = null;

      this.setState(Object.assign({}, this.state, {
        players
      }));
    });
    this.io.once('start', () => {
      this.start();
    });
    this.io.on('message', ({ data, from }) => {
      this.worker.postMessage({
        type: 'receive',
        payload: { data, from }
      });
    });
  }

  handleWorkerMsg(data) {
    console.log(data);
    const { type, payload }  = data;
    if (type === 'ready') {
      this.onReady();
    } else if (type === 'message') {
      this.io.emit('message', {
        data: payload.message,
        target: payload.target
      });
    } else if (type === 'update') {
      this.onUpdate(payload);
    } else if (type === 'error') {
      console.error(payload);
    }
  }

  start() {
    this.worker.postMessage({
      type: 'init',
      payload: {
        index: this.state.index,
        playerCount: this.state.players.length,
        cardCount: CARD_COUNT
      }
    });
    this.worker.postMessage({
      type: 'start'
    });
  }

  onReady() {
    this.store.dispatch({ type: 'READY' });
    this.onDraw();
    this.onOpen(null);
  }

  onUpdate({ index, card }) {
    this.store.dispatch({
      type: 'UPDATE_CARD',
      payload: {
        id: index,
        open: card.open,
        owner: card.owner,
        value: card.value
      }
    });
  }

  // Hooks for underlying components

  onDraw() {
    this.worker.postMessage({
      type: 'draw',
      payload: null
    });
  }

  onOpen(index) {
    this.worker.postMessage({
      type: 'open',
      payload: index
    });
  }

  render() {
    return <Provider store={this.store}>
      <Board
          onDraw={() => this.onDraw()}
          onOpen={(index) => this.onOpen(index)}/>
    </Provider>;
  }
}
module.exports = App;
