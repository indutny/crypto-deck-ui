'use strict';

const redux = require('redux');
const React = require('react');
const Provider = require('react-redux').Provider;
const ioClient = require('socket.io-client');

const ui = require('../../ui');
const actions = ui.redux.actions;
const Board = ui.containers.Board;
const Overlay = ui.containers.Overlay;

class App extends React.Component {
  constructor() {
    super();

    this.store = redux.createStore(ui.redux.reducers);
    this.worker = null;
    this.io = ioClient();

    this.handleIO();
    this.handleStore();

    const match = document.location.search.match(/cards=([1-9]\d*)/);
    let cardCount = match !== null ? (match[1] | 0) : 52;
    if (cardCount % 4 !== 0)
      cardCount = 52;
    this.store.dispatch(actions.setCardCount(cardCount));

    this.queuedCards = new Set();
    this.oldCards = [];

    this.room = '';
    this.suppressHashChange = false;
    window.onhashchange = (e) => {
      if (this.suppressHashChange) {
        this.suppressHashChange = false;
        return;
      }
      this.changeRoom();
    };
    this.changeRoom();
    this.restartWorker();
  }

  handleIO() {
    this.io.on('join', ({ index, id }) => {
      this.store.dispatch(actions.addPlayer(index, id));
      if (id === this.io.id)
        this.store.dispatch(actions.setSelfIndex(index));
    });
    this.io.on('leave', ({ index }) => {
      this.store.dispatch(actions.removePlayer(index));
    });
    this.io.on('changeRoom', () => {
      this.changeRoom();
    });
    this.io.on('start', () => {
      this.start();
    });
    this.io.on('message', ({ data, from }) => {
      this.worker.postMessage({
        type: 'receive',
        payload: { data, from }
      });
    });
  }

  restartWorker() {
    if (this.worker)
      this.worker.terminate();

    this.worker = new Worker('/js/worker.js');
    this.worker.onmessage = e => this.handleWorkerMsg(e.data);
  }

  changeRoom() {
    if (this.room) {
      this.io.emit('leave', this.room);
      this.queuedCards = new Set();
      this.oldCards = [];
      this.store.dispatch(actions.reset());
      this.restartWorker();
    }

    const currentHash = document.location.hash.slice(1);
    if (this.room !== currentHash) {
      this.room = currentHash;
    } else {
      this.room = '';
      for (let i = 0; i < 2; i++)
        this.room += Math.floor(Math.random() * 0xffffffff).toString(36);

      this.suppressHashChange = true;
      document.location.hash = '#' + this.room;
    }
    this.io.emit('join', this.room);
  }

  handleWorkerMsg(data) {
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

  handleStore() {
    this.store.subscribe(() => {
      const state = this.store.getState();
      const cards = state.cards;

      // Queue newly opened/drawn cards
      cards.filter((card) => {
        return card.index === null;
      }).filter((card) => {
        return !this.queuedCards.has(card.id);
      }).forEach((card) => {
        this.queuedCards.add(card.id);
        if (card.owner === null)
          this.open(null);
        else
          this.draw();
      });

      // Process local card updates, if any
      if (cards === this.oldCards)
        return;

      const changes = [];
      cards.forEach((card, i) => {
        // Ignore cards that were updated remotely
        if (card.remote)
          return;

        if (this.oldCards.length <= i)
          return changes.push({ from: null, to: card });

        const old = this.oldCards[i];

        // We check for:
        //   1. Updated cards, that are...
        //   2. ...allocated and... (`index !== null`)
        //   3. ...public or owned by us
        if (old !== card &&
            card.index !== null &&
            (old.owner === null || old.owner === state.players.index)) {
          changes.push({ from: old, to: card });
        }
      });

      changes.forEach(({ from, to }) => {
        if (from !== null && to.owner !== from.owner) {
          // Card opened
          if (to.owner === null)
            this.open(to.index);
          // Card changed owner
          else
            this.changeOwner(to.index, to.owner);
        }
      });

      this.oldCards = cards;
    });
  }

  start() {
    const state = this.store.getState();
    this.worker.postMessage({
      type: 'init',
      payload: {
        index: state.players.index,
        playerCount: state.players.list.length,
        cardCount: state.cardCount
      }
    });
    this.worker.postMessage({
      type: 'start'
    });
  }

  onReady() {
    this.store.dispatch(actions.ready());
  }

  onUpdate({ index, card }) {
    this.store.dispatch(actions.updateCard({
      index: index,
      remote: true,
      open: card.open,
      owner: card.owner,
      value: card.value
    }));
  }

  // Hooks for underlying components

  draw() {
    this.worker.postMessage({
      type: 'draw',
      payload: null
    });
  }

  open(index) {
    this.worker.postMessage({
      type: 'open',
      payload: index
    });
  }

  changeOwner(index, owner) {
    this.worker.postMessage({
      type: 'update',
      payload: {
        type: 'changeOwner',
        payload: {
          index,
          owner
        }
      }
    });
  }

  render() {
    return <Provider store={this.store}>
      <container id="game">
        <Board/>
        <Overlay/>
      </container>
    </Provider>;
  }
}
module.exports = App;
