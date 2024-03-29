const { db } = require("../util/admin")
const { isEmpty } = require("../util/validators")

//get: connect to posts collection and get all documents
exports.getAllPosts = (req, res) => {
  db.collection("posts")
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let posts = []
      data.forEach(doc => {
        posts.push({
          postId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage
        })
      })
      return res.send(posts)
    })
    .catch(err => console.log(err))
}

exports.createPost = (req, res) => {
  //validate post post body
  if(isEmpty(req.body.body)) return res.status(400).json({ body: 'Body must not be empty' })

  const newPost = {
    body: req.body.body,
    userHandle: req.user.handle,  //FBAuth
    createdAt: new Date().toISOString(), //admin.firestore.Timestamp.fromDate(new Date())
    userImage: req.user.imageUrl,
    likeCount: 0,
    commentCount: 0
  }

  db.collection("posts")
    .add(newPost)
    .then(doc => {
      let resPost = newPost
      resPost.postId = doc.id
      res.json(resPost)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err.code})
    })
}

exports.getPost = (req, res) => {
  let postData = {};
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(doc => {
      if(!doc.exists){
        return res.status(400).json({ error: 'Post not found' })
      }
      postData = doc.data();
      postData.postId = doc.id;
      return db.collection('comments')
        .orderBy('createdAt', 'desc') //needs me to build an index in firestore for complex query
        .where('postId', '==', req.params.postId)
        .get()
    })
    .then(data => {
      postData.comments = []
      data.forEach(doc => {
        postData.comments.push(doc.data())
      })
      return res.json(postData)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err.code})
    })
}

exports.commentOnPost = (req, res) => {
  if(req.body.body.trim() === '') return res.status(400).json({comment: 'Must not be empty'})

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    postId: req.params.postId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  }

  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(doc => {
      //confirm post exists
      if(!doc.exists){
        return res.status(400).json({ error: 'Post not found' })
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

exports.likePost = (req, res) => {
  const likeDocument = db.collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('postId', '==', req.params.postId)
    .limit(1)

  const postDocument = db.doc(`/posts/${req.params.postId}`);

  let postData = {};

  postDocument
    .get()
    .then(doc => {
      if(!doc.exists){
        return res.status(400).json({ error: 'Post not found' })
      }
      postData = doc.data();
      postData.postId = doc.id
      return likeDocument.get()
    })
    .then(data => {
      //if user never liked before (likeDocument is empty), add their like
      if(data.empty){
        return db.collection('likes').add({
          postId: req.params.postId,
          userHandle: req.user.handle
        })
        .then(() => {
          postData.likeCount++
          return postDocument.update({ likeCount: postData.likeCount })
        })
        .then(() => {
          res.json(postData)
        })
      }else{
        return res.status(400).json({ error: 'Post already liked' })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err.code})
    })
}

exports.unlikePost = (req, res) => {
  const likeDocument = db.collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('postId', '==', req.params.postId)
    .limit(1)

  const postDocument = db.doc(`/posts/${req.params.postId}`);

  let postData = {};

  postDocument
    .get()
    .then(doc => {
      if(!doc.exists){
        return res.status(400).json({ error: 'Post not found' })
      }
      postData = doc.data();
      postData.postId = doc.id
      return likeDocument.get()
    })
    .then(data => {
      //only unlike/delete if user liked before (likeDocument exists)
      if(data.empty){
        return res.status(400).json({ error: 'Post already liked' })
      }else{
        return db.doc(`/likes/${data.docs[0].id}`).delete()
        .then(() => {
          postData.likeCount--
          return postDocument.update({ likeCount: postData.likeCount })
        })
        .then(() => {
          res.json(postData)
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err.code})
    })
}

exports.deletePost = (req, res) => {
  const document = db.doc(`/posts/${req.params.postId}`)

  document.get()
    .then(doc => {
      if(!doc.exists){
        return res.status(400).json({ error: 'Post not found' })
      }
      if(doc.data().userHandle !== req.user.handle){
        return res.status(403).json({ error: 'Unauthorized' })
      }else{
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Post deleted successfully'})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err.code})
    })
}