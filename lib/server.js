#!/usr/bin/env node

const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');

const file = serveStatic(path.join(__dirname, '..', 'public'));

const server = http.createServer((req, res) => {
  file(req, res, () => {
    res.writeHead(404);
    res.end();
  });
}).listen(process.env.PORT || 8000, () => {
  console.log('Listening at %j', server.address());
});

const io = require('socket.io')(server);

const rooms = new Map();

function Room(id) {
  this.id = id;
  this.players = [];
  this.maxPlayers = 2;
  this.started = false;
}

Room.prototype.join = function join(socket) {
  if (this.started)
    return false;

  const index = this.players.length;
  this.broadcast('join', { id: socket.id, index });
  this.players.push(socket);
  for (let i = 0; i < this.players.length; i++)
    socket.emit('join', { id: this.players[i].id, index: i });

  socket.once('disconnect', () => {
    this.leave(socket);
  });

  socket.on('message', (msg) => {
    this.send(msg.data, msg.target, index);
  });

  if (!this.started && this.players.length === this.maxPlayers) {
    this.broadcast('start');
    this.started = true;
  }

  return true;
};

Room.prototype.leave = function leave(socket) {
  const index = this.players.indexOf(socket);
  if (index === -1)
    return;
  this.players[index] = null;
  this.broadcast('leave', { id: socket.id, index });

  const noneLeft = this.players.every(p => p === null);
  if (noneLeft)
    rooms.delete(this.id);

  if (this.started)
    this.broadcast('changeRoom');
};

Room.prototype.broadcast = function broadcast(type, payload) {
  for (let i = 0; i < this.players.length; i++)
    if (this.players[i] !== null)
      this.players[i].emit(type, payload);
};

Room.prototype.send = function send(msg, target, source) {
  const wrap = { data: msg, from: source };

  if (target === undefined || target === null) {
    for (let i = 0; i < this.players.length; i++)
      if (this.players[i] && i !== source)
        this.players[i].emit('message', wrap);
    return;
  }

  if (!this.players[target])
    return;
  this.players[target].emit('message', wrap);
};

io.on('connection', (socket) => {
  socket.on('join', (id) => {
    let res;
    if (rooms.has(id)) {
      res = rooms.get(id).join(socket);
    } else {
      const room = new Room(id);
      rooms.set(id, room);
      res = room.join(socket);
    }

    if (!res)
      socket.emit('changeRoom');
  });

  socket.on('leave', (id) => {
    if (rooms.has(id))
      rooms.get(id).leave(socket);
  });
});
