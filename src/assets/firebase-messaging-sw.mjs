// import * as firebase from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
// import * as messaging from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging.js';



// const firebaseConfig = {
//   apiKey: "AIzaSyC7-kFPHWTHaKaP2WFjIXWoAaf9QfSyr8Q",
//   authDomain: "contler-dev.firebaseapp.com",
//   databaseURL: "https://contler-dev.firebaseio.com",
//   projectId: "contler-dev",
//   storageBucket: "contler-dev.appspot.com",
//   messagingSenderId: "424830318314",
//   appId: "1:424830318314:web:aa057126d096f3d747c993",
//   measurementId: "G-CNY99F9HZR"
// };

// firebase.initializeApp(firebaseConfig);

// console.log(messaging);

// const msg = messaging.getMessaging();

// console.log(msg);


importScripts('https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyC7-kFPHWTHaKaP2WFjIXWoAaf9QfSyr8Q",
  authDomain: "contler-dev.firebaseapp.com",
  databaseURL: "https://contler-dev.firebaseio.com",
  projectId: "contler-dev",
  storageBucket: "contler-dev.appspot.com",
  messagingSenderId: "424830318314",
  appId: "1:424830318314:web:aa057126d096f3d747c993",
  measurementId: "G-CNY99F9HZR"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
});
