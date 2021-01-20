console.log('inside chat.js');
// const { Chat } = require('../../src/models/chat_database');
const socket = io();
// const {username ,room }= require('../../src/routers/studentroutes');
// console.log('hii')
// io();

// const dob = require('./routers/studentroutes');
// console.log(`${dob.value}`);

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//templetes
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locatioMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//options


const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

// const username = "sujith";
// const room = "student";


// console.log(studentRouter.value);

// console.log('username is', username)
// console.log('romm is', room)
//autoscroll
const autoscroll = () => {
  //new message element
  const $newMessage = $messages.lastElementChild;

  //hight of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // console.log(newMessagemargin);
  //visible height
  const visibleHeight = $messages.offsetHeight;

  //height of messages container
  const containerHeight = $messages.scrollHeight;

  //how far have i scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
}

socket.on('message', (msg) => {
  console.log(msg);
  const html = Mustache.render(messageTemplate, {
    username: msg.username,
    msg: msg.text,
    // createdAt: msg.createdAt
    createdAt: moment(msg.createdAt).format('hh:mm a')
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
})

// socket.on('locationMessage', (url) => {
socket.on('locationMessage', (message) => {
  console.log(message);
  const html = Mustache.render(locatioMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('hh:mm a')
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
})

socket.on('roomData', ({ room, online, offline }) => {
  // console.log(room);
  // console.log('inside chat.js', users);
  const html = Mustache.render(sidebarTemplate, {
    room,
    // users,
    online,
    offline
  })
  document.querySelector('#sidebar').innerHTML = html;
});

// socket.on('countUpdated', (count) => {
//     console.log('count has been updated :' + count);
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicked');
//     socket.emit('increment');
// })

// document.querySelector('#message-form').addEventListener('submit', (e) => {

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');

  //const sendmsg = document.querySelector('input').value;

  //disable
  const sendmsg = e.target.elements.message.value;

  // socket.emit('SendMessage', sendmsg, (message) =>{
  //     console.log('the message was delivered', message);
  // });

  socket.emit('SendMessage', sendmsg, (error) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus()
    if (error) {
      return console.log(error);
    }
    console.log('message delivered');
  });
})

// document.querySelector('#send-location').addEventListener('click' , () => {

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geo location is not supported by your browser. Pls update your browser...');
  }
  $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    //console.log(position);
    // const position;
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      $sendLocationButton.removeAttribute('disabled')
      console.log('Loction Shared');
    });
  })

})
// { username, room }
socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
})
