const functions = require('firebase-functions'); //59K (gzipped: 17.9K)
const admin = require('firebase-admin');  //firebase-admin for server side

//initialize firebase-admin (SERVER SIDE)
admin.initializeApp(functions.config().firebase);

//connect to database
const db = admin.firestore();

//connect to authentication
const auth = admin.auth();

//connect to storage
const store = admin.storage();

// Firebase App (the core Firebase SDK) is always required and must be listed before other Firebase SDKs
const firebase = require("firebase"); 

const storageBucket = process.env.storageBucket

firebase.initializeApp({
  apiKey: "AIzaSyAmdu0yYLsgJOqaX5Qe1BuLGZv5M_pQEuM",
  authDomain: "socialmedia-5f158.firebaseapp.com",
  databaseURL: "https://socialmedia-5f158-default-rtdb.firebaseio.com",
  projectId: "socialmedia-5f158",
  storageBucket: "socialmedia-5f158.appspot.com",
  messagingSenderId: "98194542320",
  appId: "1:98194542320:web:2ff7078b871959705abc35",
  measurementId: "G-HRYZYWYW6N"
})


module.exports = {admin, db, auth, firebase, store, storageBucket}




//Initialize firebase (CLIENT SIDE) (console: project settings -> config)
// firebase.initializeApp({
//   apiKey: functions.config().api.key,
//   authDomain: `${process.env.projectId}.firebaseapp.com`,
//   projectId: process.env.projectId,
//   storageBucket: storageBucket,
//   messagingSenderId: functions.config().api.messagingsenderid,
//   appId: functions.config().api.appid,
//   measurementId: functions.config().api.meaurementid
// })