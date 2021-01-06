const { db, firebase, store, storageBucket } = require("../util/admin")
const { validateSignup, validateLogin, reduceUserDetails } = require("../util/validators")

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  //validate fields
  const { valid, errors } = validateLogin(user)
  if(!valid) return res.status(400).json(errors)

  //firebase signin
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => data.user.getIdToken())
    .then(token => res.json({token}))
    .catch(err => {
      console.log(err)
      if(err.code === "auth/wrong-password" || err.code === "auth/user-not-found"){
        return res.status(403).json({general: 'Wrong credentials, please try again'})
      }
      return res.status(500).json({ error: err.code })
    })
}

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  }
  //validate fields
  const { valid, errors } = validateSignup(newUser)
  if(!valid) return res.status(400).json(errors)

  //image in firebase storage used to be the default for new user
  const noImage = 'no-img.png'

  //validate user is new, create a new user and give the client a token to access the users data
  let jwtToken, userid;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      return doc.exists 
        ? res.status(400).json({ handle: 'this handle is already taken'})
        : firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password) //firebase requires min password length of 6
    })
    .then(data =>  {
      userid = data.user.uid
      return data.user.getIdToken()
    })
    .then(token => {
      jwtToken = token
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${noImage}?alt=media`,
        userId: userid
      }
      //actually "set" the user after verifying using "get" that its new
      return db.doc(`/users/${newUser.handle}`).set(userCredentials)
    })
    .then(() => res.status(201).json({ token: jwtToken }))
    .catch(err => {
      console.log(err)
      if(err.code === "auth/email-already-in-use")
        return res.status(400).json({email: 'Email is already in use'})    //400, ie client error
      else
        return res.status(500).json({general: 'Something went wrong, please try again'})  //500, ie server error
    })
}

exports.uploadImage = (req, res) => {
  const BusBoy = require('busboy')
  const path = require('path')
  const os = require('os')
  const fs = require('fs')

  const busboy = new BusBoy({headers: req.headers})
  let imageFileName
  let imageToBeUploaded = {}

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    //console.log(filename) --name.png
    //console.log(fieldname)  --image
    //console.log(mimetype) --image/jpeg
    if(mimetype!='image/jpeg' && mimetype!='image/png'){
      return res.status(400).json({ error: 'Wrong file type submitted' })
    }
    // my.image.png
    const imageExtention = filename.split('.')[filename.split('.').length - 1]  //get last el in array
    // 24346723468.png (generate random image name for sever)
    imageFileName = `${Math.round(Math.random()*10000000000)}.${imageExtention}`
    const filepath = path.join(os.tmpdir(), imageFileName) //os.tmpdir gets path of computer's(or server's) temp folder, ex. C:\Users\gekcho\AppData\Local\Temp
    imageToBeUploaded = { filepath, mimetype }
    file.pipe(fs.createWriteStream(filepath))
  })

  busboy.on('finish', () => {
    store.bucket().upload(imageToBeUploaded.filepath, {
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype
        }
      }
    })
    .then(() => {
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${imageFileName}?alt=media`;
      return db.doc(`/users/${req.user.handle}`).update({ imageUrl: imageUrl })
    })
    .then(() => {
      return res.json({ message: 'Image uploaded successfully'})
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({ error: err.code })
    })
  })

  busboy.end(req.rawBody);  //IMPORTANT: otherwise call hangs
}

// add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body)

  //since userDetails is an object, it auto assign properties that are not empty in the object
  db.doc(`/users/${req.user.handle}`).update(userDetails)
    .then(() => res.json({ message: 'Details added successfully'}))
    .catch(err => {
      console.log(err)
      return res.status(500).json({ error: err.code })
    })
}

// get user data
exports.getAuthenticatedUser = (req, res) => {
  let userData = {}

  db.doc(`/users/${req.user.handle}`)
    .get()
    .then(doc => {
      if(doc.exists){
        userData.credentials = doc.data();
        return db.collection('likes').where('userHandle', '==', req.user.handle).get()
      }
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data())
      })
      return db.collection('notifications').where('recipient','==',req.user.handle)
        .orderBy('createdAt', 'desc').limit(10).get();
    })
    .then(data => {
      userData.notifications = [];
      data.forEach(doc => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          screamId: doc.data().screamId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,
        });
      })
      return res.json(userData)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).json({ error: err.code })
    })
}

//get any users details (dont need to be authorized)
exports.getUserDetails = (req, res) => {
  let userData = {}
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then(doc => {
      if(doc.exists){
        userData.user = doc.data();
        return db.collection('screams').where('userHandle', '==', req.params.handle)
          .orderBy('createdAt', 'desc')
          .get()
      }else{
        return res.status(404).json({error: 'User not found'})
      }
    })
    .then(data => {
      userData.screams = []
      data.forEach(doc => {
        userData.screams.push({
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          screamId: doc.id
        })
      })
      return res.json(userData)
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({error: err.code})
    })
}

exports.markNotificationsRead = (req, res) => {
  //batch, when you need to update multiple documents
  let batch = db.batch();
  req.body.forEach(notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, {read: true}) //update read key to be true
  });

  batch.commit()
    .then(() => {
      return res.json({message: 'Notifications marked read'});
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({error: err.code})
    })
}