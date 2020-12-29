const mongoose = require('mongoose');
const validator = require('validator');
// const { db } = require('./admin');

// // const Test = mongoose.model('Test', {
const chatSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  users: [{
    usernames: {
      type: String,
      required: true,
      trim: true
    }
  }],
  room: {
    type: String,
    required: true,
    trim: true
  }
});


const Chat = mongoose.model('Chat', chatSchema);

// //module.exports = Test;

const users = [];

//adduser, removeUser, Getuser, getusersinroom

const addUser = ({ id, username, room }) => {
  //clear the data 

  username = username.trim().toLowerCase(),
    room = room.trim().toLowerCase()

  //validate the data
  if (!username || !room) {
    return {
      error: 'username and room are required'
    }
  }

  //check for existing user 
  // const existingUser = users.find((user) => {
  //   return user.room === room && user.username === username
  // })

  // //validate username
  // if (existingUser) {
  //   return {
  //     error: 'Username is in use..!'
  //   }
  // }


  async () => {
    const exist = await Chat.find({ name: username });
    console.log(exist)
    if (exist) {
      return {
        error: 'Username is in use..!'
      }
    }
  }



  // store user 
  const user = { id, username, room }
  // console.log(user)
  users.push(user)
  // console.log(users)

  const user_data = new Chat(user);
  user_data.save().then((data) => {
    // console.log(user_data)

    // console.log('success');

    // return { user }
  }).catch((e) => {
    console.log(e)
  });
  // console.log(user)

  return { user }
}

const removeUser = async (id) => {
  const data = await Chat.findOneAndRemove({ id });
  // console.log(data);
  // await data.remove();
  const index = users.findIndex((user) => user.id === id)
  console.log(index);
  if (index !== -1) {
    console.log(users.splice(index, 1)[0])
    // console.log(users)
    return users.splice(index, 1)[0];
  }
}

const getUser = (id) => {
  // console.log(users.find((user) => user.id === id))
  return users.find((user) => user.id === id)
}

const getusersInRoom = async (room) => {
  const users = await Chat.find({});

  // const users = await Chat.find({}).then((data) => {
  //   return data
  // })

  console.log('geting room data')
  // console.log(room)
  // console.log(users)
  // for (const i in users) {

  //   console.log(users[i].username)


  // }
  // async () => {
  //   console.log('inside empty function')
  //   const users = await Chat.find({});
  //   console.log(users)
  //   // return users
  //   }
  // console.log(users)

  return users;

  // var jsonString = JSON.stringify(users);
  // console.log(jsonString)
  // return jsonString
  // return users.filter((user) => user.room === room)
}


// const getusersInRoom = async (room) => {
//   // console.log(users.filter((user) => user.room === room))
//   return users.filter((user) => user.room === room)
// const users = await Chat.find({room});
// console.log(users)
// return users
// }

// addUser({
//     id: 22,
//     username: 'sujith',
//     room: 'odepoi'
// })

// addUser({
//     id: 23,
//     username: 'sanjay',
//     room: 'odepoi'
// })
// addUser({
//     id: 12,
//     username: 'sharath',
//     room: 'ijes'
// })
// // console.log(users)

// const res = addUser({
//     id:22,
//     username: 'sujith',
//     room:'odepoi'
// })

// const removedUsers = removeUser(22);

// console.log(removedUsers);

// console.log(users)

// const user = getUser(12)
// console.log(user)

// const userlist = getusersInRoom('iqjes')

// console.log(userlist)
const msg = [];
const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime()
  }
}

const generateLocationMessage = (username, url) => {
  return {
    username,
    url,
    createdAt: new Date().getTime()
  }
}


module.exports = {
  Chat,
  addUser,
  removeUser,
  getUser,
  getusersInRoom,
  generateMessage,
  generateLocationMessage
}