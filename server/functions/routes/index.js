const express = require('express');
const FBAuth = require("../util/fbAuth")
const { 
  getAllScreams, 
  createScream, 
  getScream, 
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream
} = require('./screams')
const { 
  login, 
  signup, 
  uploadImage, 
  addUserDetails, 
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
} = require('./users')


const router = express.Router();

//*FBAuth middleware needed when you need to verify user token and add user obj to req 

//scream routes
router.get("/screams", getAllScreams)
router.post("/createScream", FBAuth, createScream)  //FBAuth is a custom middleware function that runs before createScream to autheniticate jwt token
router.get("/scream/:screamId", getScream)
router.delete('/scream/:screamId', FBAuth, deleteScream)
router.get('/scream/:screamId/like', FBAuth, likeScream)
router.get('/scream/:screamId/unlike', FBAuth, unlikeScream)
router.post('/scream/:screamId/comment', FBAuth, commentOnScream)

//user routes ("handle" = username)
//Note: One route to login user and another to get user info since it makes initial sign in faster
router.post('/login', login)
router.post('/signup', signup)
router.post('/user/image', FBAuth, uploadImage)
router.post('/user', FBAuth, addUserDetails)
router.get('/user', FBAuth, getAuthenticatedUser)
router.get('/user/:handle', getUserDetails)
router.post('/notifications', FBAuth, markNotificationsRead)

module.exports = router