const { realtime_db } = require("../util/admin")
const { binarySearch, stockArrayLength } = require("../util/stockSymbols")
const FBAuth = require("../util/fbAuth")

var updateStock = {
  requireAuthentication: FBAuth,
  update: function(req, res, next) {
      const new_avg_price = ((req.body.current_data.avg_price*req.body.current_data.shares) + (req.body.price*req.body.shares))/(req.body.current_data.shares+req.body.shares)
      const new_share_count = req.body.current_data.shares + req.body.shares
    
      const availableStock = binarySearch(req.body.symbol, 0, stockArrayLength())

      if(availableStock){
        realtime_db.ref(`users/${req.user.handle}/portfolio/${req.body.symbol}`).set({
          avg_price: new_avg_price,
          shares: new_share_count
        }).then(() => {
          req.params.handle = req.user.handle;
          next();
        })
      }else{
        res.status(406).json({error: "Invalid stock symbol"})
      }
  }
}

var deleteStock = {
  requireAuthentication: FBAuth,
  delete: function(req, res, next) {
    realtime_db.ref(`users/${req.user.handle}/portfolio/${req.body.symbol}`)
      .remove()
      .then(() => {
        req.params.handle = req.user.handle;
        next();
      })
  }
}

module.exports = {
  updateStock,
  deleteStock
}