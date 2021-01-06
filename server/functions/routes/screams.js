const { db } = require("../util/admin")
const { isEmpty } = require("../util/validators")

//get: connect to screams collection and get all documents
exports.getAllScreams = (req, res) => {
  db.collection("screams")
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let screams = []
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage
        })
      })
      return res.send(screams)
    })
    .catch(err => console.log(err))
}

exports.createScream = (req, res) => {
  //validate scream post body
  if(isEmpty(req.body.body)) return res.status(400).json({ body: 'Body must not be empty' })

  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,  //FBAuth
    createdAt: new Date().toISOString(), //admin.firestore.Timestamp.fromDate(new Date())
    userImage: req.user.imageUrl,
    likeCount: 0,
    commentCount: 0
  }

  db.collection("screams")
    .add(newScream)
    .then(doc => {
      let resScream = newScream
      resScream.screamId = doc.id
      res.json(resScream)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err.code})
    })
}

exports.getScream = (req, res) => {
  let screamData = {};
  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then(doc => {
      if(!doc.exists){
        return res.status(400).json({ error: 'Scream not found' })
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db.collection('comments')
        .orderBy('createdAt', 'desc') //needs me to build an index in firestore for complex query
        .where('screamId', '==', req.params.screamId)
        .get()
    })
    .then(data => {
      screamData.comments = []
      data.forEach(doc => {
        screamData.comments.push(doc.data())
      })
      return res.json(screamData)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err.code})
    })
}

exports.commentOnScream = (req, res) => {
  if(req.body.body.trim() === '') return res.status(400).json({comment: 'Must not be empty'})

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screamId: req.params.screamId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  }

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then(doc => {
      //confirm scream exists
      if(!doc.exists){
        return res.status(400).json({ error: 'Scream not found' })
      }
      //increment commentCount and return the updated doc
      return doc.ref.update({ commentCount: doc.data().commentCount + 1}) 
    })
    .then(() => {
      db.collection('comments').add(newComment);
    })
    .then(() => {
      res.json(newComment)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err.code})
    })
}

exports.likeScream = (req, res) => {
  const likeDocument = db.collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId)
    .limit(1)

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  let screamData = {};

  screamDocument
    .get()
    .then(doc => {
      if(!doc.exists){
        return res.status(400).json({ error: 'Scream not found' })
      }
      screamData = doc.data();
      screamData.screamId = doc.id
      return likeDocument.get()
    })
    .then(data => {
      //if user never liked before (likeDocument is empty), add their like
      if(data.empty){
        return db.collection('likes').add({
          screamId: req.params.screamId,
          userHandle: req.user.handle
        })
        .then(() => {
          screamData.likeCount++
          return screamDocument.update({ likeCount: screamData.likeCount })
        })
        .then(() => {
          res.json(screamData)
        })
      }else{
        return res.status(400).json({ error: 'Scream already liked' })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err.code})
    })
}

exports.unlikeScream = (req, res) => {
  const likeDocument = db.collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId)
    .limit(1)

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  let screamData = {};

  screamDocument
    .get()
    .then(doc => {
      if(!doc.exists){
        return res.status(400).json({ error: 'Scream not found' })
      }
      screamData = doc.data();
      screamData.screamId = doc.id
      return likeDocument.get()
    })
    .then(data => {
      //only unlike/delete if user liked before (likeDocument exists)
      if(data.empty){
        return res.status(400).json({ error: 'Scream already liked' })
      }else{
        return db.doc(`/likes/${data.docs[0].id}`).delete()
        .then(() => {
          screamData.likeCount--
          return screamDocument.update({ likeCount: screamData.likeCount })
        })
        .then(() => {
          res.json(screamData)
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err.code})
    })
}

exports.deleteScream = (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`)

  document.get()
    .then(doc => {
      if(!doc.exists){
        return res.status(400).json({ error: 'Scream not found' })
      }
      if(doc.data().userHandle !== req.user.handle){
        return res.status(403).json({ error: 'Unathorized' })
      }else{
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Scream deleted successfully'})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err.code})
    })
}