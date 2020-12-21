const express = require('express');
require('./db/mongoose');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const hbs = require('hbs');
const bodyparser = require('body-parser');
const studentRouter = require('./routers/studentroutes');
// const Server_chat = require('./server');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../views/views');
const partialsPath = path.join(__dirname, '../views/partials')
// require('./server');


// const viewsPath = path.join(__dirname,'../views');
app.set('view engine', 'hbs');
app.set('views', viewsPath);

hbs.registerPartials(partialsPath);
app.use(express.static(publicDirectoryPath));
app.use(studentRouter);
// app.use(Server_chat)
app.use(express.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

//*******************chat System******************************* */

const Filter = require('bad-words');
// const { generateMessage, generateLocationMessage } = require('./utils/messages');
const Chat = require('./models/chat_database');
const { addUser, removeUser, getUser, getusersInRoom, generateMessage, generateLocationMessage } = require('./models/chat_database');

io.on('connection', (socket) => {
  console.log('New webSocket Connection');
  socket.on('join', (options, callback) => {
    // console.log(options)
    const { error, user } = addUser({ id: socket.id, ...options })
    if (error) {
      return callback(error)
    }
    socket.join(user.room);
    socket.emit('message', generateMessage('Admin', 'welcome!'));
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));
    // io.to(user.room).emit('roomData', {
      
    //  let data = Promise.resolve(getusersInRoom(user.room));
    //   getusersInRoom(user.room).then((user_value) =>{
    //    console.log(user_value);

    //   data = user_value;
    //   return user_value
    // }).catch((e)=> {
    //   console.log(e)
    // })
// console.log(data)
// let data = getusersInRoom(user.room);

// // let a;
// const printAddress = async () => {
//    const a = await data;
//   // console.log(a);
//   return a;
// };
// // console.log(a);
// let d = printAddress();
// console.log(d)

getusersInRoom(user.room).then((user_value) =>{
//   console.log(user_value);

//  data = user_value;
//  return user_value

io.emit('roomData', {
  room: user.room,
  users: user_value
});
}).catch((e)=> {
 console.log(e)
})

    // io.emit('roomData', {
    //   room: user.room,
    //   // users: a
    // });
    // console.log(user.room)
    // console.log(getusersInRoom(user.room))
    callback();
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
  })

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