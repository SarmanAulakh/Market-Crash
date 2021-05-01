const express = require('express');
const FBAuth = require("../util/fbAuth")
const {
  getAllPosts,
  createPost,
  getPost,
  commentOnPost,
  likePost,
  unlikePost,
  deletePost,
} = require("./posts");
const { 
  login, 
  signup, 
  uploadImage, 
  addUserDetails, 
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
} = require('./users')
const {
  getPortfolioData,
  deletePortfolioData,
  getWeeklyBalances
} = require('./stocks')
const {
  updateStock,
  deleteStock,
  getMetrics
} = require('../middleware/StockMiddleware')



const router = express.Router();

//!FBAuth middleware needed when you need to verify user token and add user obj to req 

//post routes
router.get("/posts", getAllPosts)
router.post("/createPost", FBAuth, createPost)  //FBAuth is a custom middleware function that runs before createPost to autheniticate jwt token
router.get("/post/:postId", getPost);
router.delete("/post/:postId", FBAuth, deletePost);
router.get("/post/:postId/like", FBAuth, likePost);
router.get("/post/:postId/unlike", FBAuth, unlikePost);
router.post("/post/:postId/comment", FBAuth, commentOnPost);

//user routes ("handle" = username)
//Note: One route to login user and another to get user info since it makes initial sign in faster
router.post('/login', login)
router.post('/signup', signup)
router.post('/user/image', FBAuth, uploadImage)
router.post('/user', FBAuth, addUserDetails)
router.get('/user', FBAuth, getAuthenticatedUser)
router.get('/user/:handle', getUserDetails)
router.post('/notifications', FBAuth, markNotificationsRead)


//Stock market routes
router.get('/portfolio/:handle', getMetrics, getPortfolioData)
//router.post('/portfolio/:handle', getWeeklyBalances)
router.post('/portfolio', [updateStock.requireAuthentication, updateStock.update], getPortfolioData)
router.delete('/portfolio', [deleteStock.requireAuthentication, deleteStock.delete], getPortfolioData)

module.exports = router