const functions = require('firebase-functions'); //59K (gzipped: 17.9K)
const { db } = require('../util/admin')

exports.createNotificationOnLike = functions.firestore.document('likes/{screamId}')
  .onCreate((snapshot) => {
    return db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        //if doc exists and user liking it is not the owner of the scream
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
          return db.doc(`/notifications/${snapshot.id}`)
            .set({
              createdAt: new Date().toISOString(),
              recipient: doc.data().userHandle,
              sender: snapshot.data().userHandle,
              type: 'like',
              read: false,
              screamId: doc.id
            })
        }
      })
      .catch(err => console.error(err))
  })

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{screamId}')
  .onDelete(snapshot => {
    return db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => console.error(err))
  })

exports.createNotificationOnComment = functions.firestore.document('comments/{screamId}')
  .onCreate((snapshot) => {
    return db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
          return db.doc(`/notifications/${snapshot.id}`)
            .set({
              createdAt: new Date().toISOString(),
              recipient: doc.data().userHandle,
              sender: snapshot.data().userHandle,
              type: 'comment',
              read: false,
              screamId: doc.id
            })
        }
      })
      .catch(err => console.error(err))
  })

// update userImage url on every scream when its updated in users collection
exports.onUserImageChange = functions.firestore.document('users/{userId}')
  .onUpdate(change => {
    //change obj has 2 properties: change.before.data() and change.after.data()
    if(change.before.data().imageUrl != change.after.data().imageUrl){
      //updating multiple documents
      const batch = db.batch(); 
      return db.collection('screams')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, {userImage: change.after.data().imageUrl})
          })
          return batch.commit();
        })
        .catch(err => console.log(err))
    } else{
      return true;
    }
  })

//When a scream is deleted, delete all likes/comments/notifications related to that scream
exports.onScreamDelete = functions.firestore.document('screams/{screamId}')
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db.collection('comments')
      .where('screamId', '==', screamId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`))
        })
        return db
          .collection('likes')
          .where('screamId', '==', screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`))
        })
        return db
          .collection('notifications')
          .where('screamId', '==', screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`))
        })
        return batch.commit();
      })
      .catch(err => console.log(err))
  })
