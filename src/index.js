const express = require('express');
require('./db/mongoose');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const hbs = require('hbs');
const bodyparser = require('body-parser');
const router = require('./routers/studentroutes');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../views/views');
const partialsPath = path.join(__dirname, '../views/partials')

app.set('view engine', 'hbs');
app.set('views', viewsPath);

hbs.registerPartials(partialsPath);
app.use(express.static(publicDirectoryPath));
app.use(router);
app.use(express.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

//*******************chat System******************************* */
const Filter = require('bad-words');
const { addUser, removeUser, getUser, getusersInRoom, generateMessage, generateLocationMessage } = require('./models/chat_database');
io.on('connection', (socket) => {
  console.log('New webSocket Connection');
  socket.on('join', async (options, callback) => {
    console.log('options:', options);
    if (options.room === 'student') {
      const room = await Room.findOne({ mainUser: options.username });
      // console.log('from Room Databse::', room)
      const { error, user } = await addUser({ id: socket.id, ...options })
      // console.log('student::', user);
      if (error) {
        return callback(error)
      }

      socket.join(user.room);
      socket.emit('message', generateMessage('Admin', 'welcome!'));
      socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));

      getusersInRoom(user.room).then((user_value) => {
        // console.log('data from getuserinroom ::', user_value)
        io.emit('roomData', {
          room: user.room,
          users: user_value
        });
      }).catch((e) => {
        console.log(e)
      })
      callback();


    } else if (options.room === 'teacher') {
      const room = await Room.findOne({ mainUser: options.username });
      // console.log('from Room Databse::', room)
      const { error, user } = await addUser({ id: socket.id, ...options })
      // console.log('teacher user', user)
      if (error) {
        return callback(error)
      }

      socket.join(user.room);
      socket.emit('message', generateMessage('Admin', 'welcome!'));
      socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));
      getusersInRoom(user.room).then((user_value) => {
        // console.log('users in room', user_value)
        io.emit('roomData', {
          room: user.room,
          users: user_value
        });
      }).catch((e) => {
        console.log(e)
      })
      callback();

    }
  })

  socket.on('SendMessage', (msg, callback) => {
    console.log(socket.id)
    const user = getUser(socket.id);
    const filter = new Filter()
    if (filter.isProfane(msg)) {
      return callback('Profanity is not allowed...!');
    }
    io.to(user.room).emit('message', generateMessage(user.username, msg));
    callback();
  });

  socket.on('sendLocation', (sendloc, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${sendloc.latitude},${sendloc.longitude}`));
    callback();
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getusersInRoom(user.room)
      });
    }
  })
})

//************************************************************* */
server.listen(port, () => {
  console.log('server is up on port:' + port);
});
