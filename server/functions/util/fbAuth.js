const { db, auth } = require("../util/admin")

const FBAuth = (req, res, next) => {
  let idToken;

  //gets the jwt token sent in client header
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
    idToken = req.headers.authorization.split('Bearer ')[1]
  }else{
    console.log("No token found")
    return res.status(403).json({ error: "Unauthorized" })
  }

  auth
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken

      //get user handle from db
      return db
        .collection("users")
        .where("userId", '==', req.user.uid)
        .limit(1)
        .get()
    })
    .then(data => {
      req.user.handle = data.docs[0].data().handle
      req.user.imageUrl = data.docs[0].data().imageUrl
      return next(); //finish middleware and go to route calling middleware (ex "/createScream")
    })
    .catch(err => {
      console.log("Error while verifying token: ", err)
      res.status(403).json(err)
    })
}

module.exports = FBAuth