const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getusersInRoom } = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
// const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

let count = 0;
console.log('inside server.js');
io.on('connection', (socket) => {
  console.log('New webSocket Connection');

  // socket.emit('countUpdated',count);

  // socket.on('increment', () => {
  //     count++;
  //     // socket.emit('countUpdated',count);
  //     io.emit('countUpdated',count);
  // })

  // socket.emit('message', 'welcome!');

  // socket.emit('message', {
  //      text:'welcome!',
  //      createdAt: new Date().getTime()
  //     });

  // socket.emit('message', generateMessage('welcome!'));

  // socket.broadcast.emit('message', 'A new User has joined');
  // socket.broadcast.emit('message', generateMessage('A new User has joined'));

  // socket.on('join', ({ username, room}, callback) => {

  socket.on('join', (options, callback) => {

    // const { error, user } = addUser({
    //     id: socket.id,
    //     username,
    //     room
    // })
    const { error, user } = addUser({ id: socket.id, ...options })

    if (error) {
      return callback(error)
    }

    socket.join(user.room);

    //socket.emit, io.emit, socket.broadcast.emit
    //io.to.emit, socket.broadcast.to.emit
    socket.emit('message', generateMessage('Admin', 'welcome!'));
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getusersInRoom(user.room)
    });
    callback();

  })

  socket.on('SendMessage', (msg, callback) => {

    const user = getUser(socket.id);

    const filter = new Filter()
    if (filter.isProfane(msg)) {
      return callback('Profanity is not allowed...!');
    }

    // io.emit('message',msg);
    io.to(user.room).emit('message', generateMessage(user.username, msg));
    callback();
  })

  socket.on('sendLocation', (sendloc, callback) => {

    const user = getUser(socket.id);

    // io.emit('message',`location: ${sendloc.latitude}, ${sendloc.longitude}`);
    // 'io.emit('locationMessage',`https://google.com/maps?q=${sendloc.latitude},${sendloc.longitude}`);
    // io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${sendloc.latitude},${sendloc.longitude}`));
    io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${sendloc.latitude},${sendloc.longitude}`));
    callback();
  })


  socket.on('disconnect', () => {

    const user = removeUser(socket.id);

    if (user) {
      // io.emit('message',generateMessage('A user has left..!'));
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getusersInRoom(user.room)
      });
    }

    // io.emit('message','A user has left..!')
    // io.emit('message',generateMessage('A user has left..!'));
  })
})

// server.listen(port, () => {
//   console.log(`server is up on port :${port}!`);
// })