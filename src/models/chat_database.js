const mongoose = require('mongoose');
const validator = require('validator')

// // const Test = mongoose.model('Test', {
const chatSchema = new mongoose.Schema({
  id:{
    type: String,
    required: true
  },
  username: {
        type: String,
        required: true,
        trim: true
    },
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
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })

  //validate username
  if (existingUser) {
    return {
      error: 'Username is in use..!'
    }
  }

  // store user 
  const user = { id, username, room }
  // console.log(user)
  users.push(user)
  const user_data = new Chat(user);
  user_data.save().then((data)=>{
    // console.log(user_data)
  }).catch((e) => {
    console.log(e)
  });
  // console.log(Chat.find({}))
  return { user }

}

const removeUser = async (id) => {
  const data = await Chat.findOneAndRemove({id});
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
  return users.find((user) => user.id === id)

}

const getusersInRoom = async (room) => {
  // return users.filter((user) => user.room === room)
  const users = await Chat.find({});
  console.log(users)
}

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