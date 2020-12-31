const mongoose = require('mongoose');
const validator = require('validator');
const Room = require('./room')

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
const users = [];

const addUser = async ({ id, username, room }) => {
  username = username.trim().toLowerCase(),
    room = room.trim().toLowerCase()

  //validate the data
  if (!username || !room) {
    return {
      error: 'username and room are required'
    }
  }

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
  await user_data.save().then((data) => {
  }).catch((e) => {
    console.log(e)
  });
  // console.log(user)

  return { user }
}


const removeUser = async (id) => {
  const data = await Chat.findOneAndRemove({ id });
  const index = users.findIndex((user) => user.id === id)
  console.log(index);
  if (index !== -1) {
    console.log('before return ::', users.splice(index, 1)[0])
    // return users.splice(index, 1)[0];
    const removedChatData = users.splice(index, 1)[0]
    console.log(removedChatData);
    return removedChatData;
  }
}



const getUser = (id) => {
  // console.log(users.find((user) => user.id === id))
  return users.find((user) => user.id === id)
}

const getusersInRoom = async (room) => {
  const users = await Chat.find({});
  return users;
}

const msg = [];

const generateMessage = (id, username, text) => {
  msg.push({
    id,
    username,
    text,
    createdAt: new Date().getTime()
  });
  const message =  Room.findOneAndUpdate({mainUser: id},{message:msg})
  return {
    username,
    text,
    createdAt: new Date().getTime()
  }
}

const generateLocationMessage = (id, username, url) => {
  msg.push({
    id,
    username,
    url,
    createdAt: new Date().getTime()
  });
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
