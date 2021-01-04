const express = require('express');
require('./db/mongoose');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const hbs = require('hbs');
const bodyparser = require('body-parser');
const router = require('./routers/studentroutes');
// const Server_chat = require('./server');
// const { name, roll} = require('./routers/studentroutes');

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
// app.use(Server_chat)
app.use(express.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

//*******************chat System******************************* */

const Filter = require('bad-words');
const { addUser, removeUser, getUser, getusersInRoom, generateHistoryMessage, generateMessage, generateLocationMessage } = require('./models/chat_database');
const Room = require('./models/room');
const User = require('./models/users')
let room;

io.on('connection', (socket) => {
  console.log('New webSocket Connection');
  socket.on('join', async (options, callback) => {
    console.log('options:', options);
      const mainId = await User.findById({ _id: options.username });
      console.log('student database::', mainId.name);
      room = await Room.findById({ _id: options.room });
      const { error, user } = await addUser({ id: socket.id, ...options })
      if (error) {
        return callback(error)
      }
      socket.join(user.room);
      const roomMainUser = await Room.findOne({ mainUser: room.mainUser });
      const count = roomMainUser.message.length;
      console.log(count);
      let i = 0;
      while (i < count) {

        socket.emit('message', await generateHistoryMessage(room.mainUser, i));
        i++;
      }
      socket.emit('message', await generateMessage(room.mainUser, 'Admin', 'welcome!'));
      socket.broadcast.to(user.room).emit('message', await generateMessage(room.mainUser, 'Admin', `${user.username} has joined!`));

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
 })

  socket.on('SendMessage', async (msg, callback) => {
    const id = room.mainUser;
    const user = await getUser(socket.id);
    const filter = new Filter()
    if (filter.isProfane(msg)) {
      return callback('Profanity is not allowed...!');
    }
    io.to(user.room).emit('message', await generateMessage(id, user.username, msg));
    callback();
  });

  socket.on('sendLocation', (sendloc, callback) => {
    const id = room.mainUser;
    // console.log(room.mainUser)
    const user = getUser(socket.id);
    io.to(user.room).emit('locationMessage', generateLocationMessage(id, user.username, `https://google.com/maps?q=${sendloc.latitude},${sendloc.longitude}`));
    callback();
  })

  socket.on('disconnect', async () => {
    const id = room.mainUser;
    const user = await removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', await generateMessage(id, 'Admin', `${user.username} has left!`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: await getusersInRoom(user.room)
      });
    }
  })
})

//************************************************************* */
server.listen(port, () => {
  console.log('server is up on port:' + port);
});
