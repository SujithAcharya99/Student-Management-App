const mongoose = require('mongoose');
const validator = require('validator');
const Room = require('./room');
const User = require('./users')
// const { db } = require('./admin');

// // const Test = mongoose.model('Test', {
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

// //module.exports = Test;

const users = [];

//adduser, removeUser, Getuser, getusersinroom

const addUser = async ({ id, username, room }) => {
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
    // const exist = await Chat.find({ name: username });
    const exist = await Chat.findone({ userId: username });

    // console.log(exist)
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
  const mainUserName = await User.findById({ _id: username });

  const user_data = new Chat({
    id: user.id,
    userId: user.username,
    username: mainUserName.name,
    room: user.room
  });

  // const user_data = new Chat(user);
  await user_data.save().then((data) => {
    // console.log(data)

    // console.log('success');

    // return { user }
  }).catch((e) => {
    console.log(e)
  });
  // console.log(user)

  return { user }
}

// const removeUser = async (id) => {
// const removeUser =  (id) => {
//   // const data = await Chat.findOneAndRemove({ id });
//   // console.log('data from chat',data);
//   // await data.remove();
//   const index = users.findIndex((user) => user.id === id)
//   console.log(index);
//   if (index !== -1) {
//     console.log(users.splice(index, 1)[0]);
//     // console.log(users)
//     return users.splice(index, 1)[0];
//   }
// }


const removeUser = async (id) => {
  const data = await Chat.findOneAndRemove({ id });
  // console.log('**************************************');
  // console.log('before user remove ::', users);
  // console.log('**************************************');

  const index = users.findIndex((user) => user.id === id)
  // console.log(index);
  if (index !== -1) {
    const removedChatData = await users.splice(index, 1)[0];
    // console.log('before return ::', users.splice(index, 1)[0])
    // console.log('before return ::', removedChatData)

    // return users.splice(index, 1)[0];
    // const removedChatData = await users.splice(index, 1)[0];
    // console.log('console ::',removedChatData);
    // console.log('*************************************')
    // console.log('after user remove ::', users);
    // console.log('**************************************');

    // return {
    //   username: 'sujith',
    //   room: 'student'
    // };
    // console.log(removedChatData);
    //  return removedChatData;
    return data;
  }
}



const getUser = async (id) => {
  // console.log('getuser::',users.find((user) => user.id === id))
  const users = await Chat.findOne({ id: id });
  // console.log(users)
  return users;
  // return users.find((user) => user.id === id)
}

const getusersInRoom = async (room) => {
  const users = await Chat.find({});

  // const users = await Chat.find({}).then((data) => {
  //   return data
  // })

  // console.log('geting room data')
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
const generateHistoryMessage = async (id, chatSize) => {
  const roomHistoryMessage = await Room.findById({ _id: id })
  const messageData = roomHistoryMessage.message[chatSize]

  // console.log('History Message ::'+ chatSize +'::'+roomHistoryMessage.message[chatSize])
  // msg.push({
  //   id,
  //   username,
  //   url,
  //   createdAt: new Date().getTime()
  // });
  // console.log(msg)

  // console.log(messageData)

  return {
    username: messageData.username,
    text: messageData.text,
    createdAt: messageData.createdAt
  }

}
let msg = [];


const generateMessage = async (id, username, text) => {
  // console.log('inside generateMessage and id :: ',id)
  //***************************************8 */
  // const msg = [];

  msg.push({
    id,
    username,
    text,
    createdAt: new Date().getTime()
  });

  // console.log('Message :: ',msg)
  // console.log(msg.reverse());
  // const roomMessage = await Room.findOneAndUpdate({mainUser: id},{message:msg})
  // const roomMessage = await Room.findOneAndUpdate({mainUser: id},{message:msg})
  const roomMessage = await Room.findById({ _id: id })

  if (roomMessage) {
    // console.log('room message data updated');

    // "username" : "Admin",
    // "text" : "welcome!",
    // "createdAt" : "1609583539565"
    // roomMessage.message.push([{
    //   username: msg.username,
    //   text: msg.text,
    //   createdAt: msg.createdAt
    // }]);
    // roomMessage.save();
    // console.log('message from room ::', roomMessage.message);
    // let roomMsg = [];
    let roomHistoryData = [];
    // for (const i in roomMessage.message) {
    //   // roomMsg.push(await roomMessage.message[i]);
    //   console.log( '*',roomMessage.message[i]);
    // }
    // roomMsg.push( roomMessage.message);
    // console.log('array element[] ::',roomMsg)

    // console.log('message from room ::')
    roomMessage.message.forEach(element => {
      // console.log('*',element);
      roomHistoryData.push(element)
      // roomMsg.push(element);
    });
    // console.log('*', roomHistoryData);

    msg.forEach(element => {
      roomHistoryData.push(element)
    });
    // console.log('array element[] ::', roomHistoryData)
    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    // msg.forEach(element => {
    //   roomMsg.push(element)
    // });
    // roomMsg.push(msg)
    // console.log('array element[] ::', roomMsg)
    // findById({ _id: id })
    // const message = await Room.findOneAndUpdate({ _id: id }, { message: roomHistoryData })
    const message = await Room.findByIdAndUpdate({ _id: id }, { message: roomHistoryData })

    return {
      username,
      text,
      createdAt: new Date().getTime()
    }
  } else {
    console.log('error....!');
  }

  // return {
  //   username,
  //   text,
  //   createdAt: new Date().getTime()
  // }
}

const generateLocationMessage = async (id, username, text) => {
  // console.log(id)
  // console.log(username)
  // console.log(text)
  


  // msg.push({
  //   id,
  //   username,
  //   text,
  //   createdAt: new Date().getTime()
  // });
  msg.push({
    id,
    username,
    text,
    createdAt: new Date().getTime()
  });
  // console.log(msg)
  
  const roomMessage = await Room.findById({ _id: id })
  if (roomMessage) {
    let roomHistoryData = [];
    roomMessage.message.forEach(element => {
      roomHistoryData.push(element)
    });
    msg.forEach(element => {
      roomHistoryData.push(element)
    });
    const message = await Room.findByIdAndUpdate({ _id: id }, { message: roomHistoryData })

    return {
      username,
      text,
      createdAt: new Date().getTime()
    }
  } else {
    console.log('error....!');
  }
  // console.log(msg)
  // return {
  //   username,
  //   url,
  //   createdAt: new Date().getTime()
  // }
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