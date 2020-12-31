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
// require('./server');

// const viewsPath = path.join(__dirname,'../views');
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
// const {ans} = require('./routers/studentroutes');

// console.log(studentRouter.value);

const Filter = require('bad-words');
// const { generateMessage, generateLocationMessage } = require('./utils/messages');
// const {Chat} = require('./models/chat_database');
const { addUser, removeUser, getUser, getusersInRoom, generateMessage, generateLocationMessage } = require('./models/chat_database');
const Room = require('./models/room');
// const Student = require('./models/student');
// const Teacher = require('./models/teacher');
let room;

io.on('connection', (socket) => {
  console.log('New webSocket Connection');
  socket.on('join', async (options, callback) => {
    console.log('options:', options);
    // console.log('username',exports);
    // console.log('value from router ',getUserId());
    if (options.room === 'student') {
      // const mainId = await Student.findById({ _id: options.username });
      // console.log('student database::', mainId.name);
       room = await Room.findOne({ mainUser: options.username });
      // console.log('from Room Databse::', room)
      const { error, user } = await addUser({ id: socket.id, ...options })
      // console.log('student::', user);
      if (error) {
        return callback(error)
      }

      socket.join(user.room);
      socket.emit('message', generateMessage(room.mainUser, 'Admin', 'welcome!'));
      socket.broadcast.to(user.room).emit('message', generateMessage(room.mainUser,'Admin', `${user.username} has joined!`));

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
      // const mainId = await Teacher.findById({ _id: options.username });
      // console.log('teacher database::', mainId.name);
      const room = await Room.findOne({ mainUser: options.username });
      // console.log('from Room Databse::', room)
      const { error, user } = await addUser({ id: socket.id, ...options })
      // console.log('teacher user', user)
      if (error) {
        return callback(error)
      }

      socket.join(user.room);
      socket.emit('message', generateMessage(room.mainUser,' Admin', 'welcome!'));
      socket.broadcast.to(user.room).emit('message', generateMessage(room.mainUser, 'Admin', `${user.username} has joined!`));
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
    // const { error, user } = addUser({ id: socket.id, ...options })
    // console.log(user)
    // if (error) {
    //   return callback(error)
    // }
    // socket.join(user.room);
    // socket.emit('message', generateMessage('Admin', 'welcome!'));
    // socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));
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

    // getusersInRoom(user.room).then((user_value) => {
    //   console.log(user_value);

    //  data = user_value;
    //  return user_value

    // io.emit('roomData', {
    //     room: user.room,
    //     users: user_value
    //   });
    // }).catch((e) => {
    //   console.log(e)
    // })

    // io.emit('roomData', {
    //   room: user.room,
    //   // users: a
    // });
    // console.log(user.room)
    // console.log(getusersInRoom(user.room))
    // callback();

    // io.to(user.room).emit('roomData', {
    //   room: user.room,
    //   users: getusersInRoom(user.room)
    // });
    // callback();
    // *************************

    // const exist = await Chat.find({ name: username });
    // console.log(exist)
    // if (exist) {
    //   return {
    //     error: 'Username is in use..!'
    //   }
    // }

    // **************************

  })

  socket.on('SendMessage',  (msg, callback) => {
    const id = room.mainUser;
    // console.log(room.mainUser)
    // console.log(socket.id)
    const user =  getUser(socket.id);
    // console.log(msg)
    const filter = new Filter()
    if (filter.isProfane(msg)) {
      return callback('Profanity is not allowed...!');
    }
     io.to(user.room).emit('message',  generateMessage(id, user.username, msg));
      callback();
  });

  socket.on('sendLocation', (sendloc, callback) => {
    const id = room.mainUser;
    // console.log(room.mainUser)
    const user = getUser(socket.id);
    io.to(user.room).emit('locationMessage', generateLocationMessage(id, user.username, `https://google.com/maps?q=${sendloc.latitude},${sendloc.longitude}`));
    callback();
  })

  socket.on('disconnect',async() => {
    // const id = room.mainUser;
    // console.log(room.mainUser)
    console.log('inside disconnect')

    const user = await removeUser(socket.id);
    console.log('removed chat data ',user)
//********************testing***************** */
    if (user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
    }

    // removeUser(socket.id).then((user)=>{
      // console.log('disconnect massage',user);

      // if (user) {
      //   io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
      //   io.to(user.room).emit('roomData', {
      //     room: user.room,
      //     users: getusersInRoom(user.room)
      //   });
      // }
      
    // }).catch((e) => {
    //   console.log(e)
    // })
    // console.log('disconnect massage',user)

    // if (user) {
    //   io.to(user.room).emit('message', generateMessage(id, 'Admin', `${user.username} has left!`));
    //   io.to(user.room).emit('roomData', {
    //     room: user.room,
    //     users: getusersInRoom(user.room)
    //   });
    // }
  })
})

//************************************************************* */
server.listen(port, () => {
  console.log('server is up on port:' + port);
});