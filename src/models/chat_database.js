const mongoose = require('mongoose');
const validator = require('validator');
const Room = require('./room');
const User = require('./users')

const chatSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
    trim: true
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
  //clear the data 

  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!username || !room) {
    return {
      error: 'username and room are required'
    }
  }

  async () => {
    // const exist = await Chat.find({ name: username });
    const exist = await Chat.findone({ userId: username });

    console.log(exist)
    if (exist) {
      return {
        error: 'Username is in use..!'
      }
    }
  }

  // store user 
  const user = { id,username, room }
  users.push(user)
  const mainUserName = await User.findById({ _id: username });

  const user_data = new Chat({
    id: user.id,
    userId:user.username,
    username: mainUserName.name,
    room: user.room
  });

  await user_data.save().then((data) => {
    // console.log(data)
    // console.log('success');
  }).catch((e) => {
    console.log(e)
  });

  return { user }
}

const removeUser = async (id) => {
  const data = await Chat.findOneAndRemove({ id });
  const index = users.findIndex((user) => user.id === id)
  console.log(index);
  if (index !== -1) {
    const removedChatData = await users.splice(index, 1)[0];
    return removedChatData;
  }
}



const getUser = (id) => {
  return users.find((user) => user.id === id)
}

const getusersInRoom = async (room) => {
  const users = await Chat.find({});
  return users;
}

const generateHistoryMessage = async (id, chatSize) => {
  const roomHistoryMessage = await Room.findOne({ mainUser: id })
  const messageData = roomHistoryMessage.message[chatSize]
  return {
    username : messageData.username,
    text: messageData.text,
    createdAt: messageData.createdAt
  }
}

const generateMessage = async (id, username, text) => {
const msg = [];

  msg.push({
    id,
    username,
    text,
    createdAt: new Date().getTime()
  });
  const roomMessage = await Room.findOne({ mainUser: id })

  if (roomMessage) {
    let roomHistoryData = [];
    roomMessage.message.forEach(element => {
      roomHistoryData.push(element)
    });
    msg.forEach(element => {
      roomHistoryData.push(element)
    });
    const message = await Room.findOneAndUpdate({ mainUser: id }, { message: roomHistoryData })
    return {
      username,
      text,
      createdAt: new Date().getTime()
    }
  } else {
    console.log('error....!');
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
  generateHistoryMessage,
  generateMessage,
  generateLocationMessage
}
