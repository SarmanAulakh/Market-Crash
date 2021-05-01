const { realtime_db } = require("../util/admin")
const { binarySearch, getExchangeArray } = require("../util/stockSymbols")
const FBAuth = require("../util/fbAuth")

var updateStock = {
  requireAuthentication: FBAuth,
  update: function(req, res, next) {
      const new_avg_price = ((req.body.current_data.avg_price*req.body.current_data.shares) + (req.body.price*req.body.shares))/(req.body.current_data.shares+req.body.shares)
      const new_share_count = req.body.current_data.shares + req.body.shares
      
      const exchangeArray = getExchangeArray(req.body.exchange)
      const availableStock = binarySearch(req.body.symbol, 0, exchangeArray.length-1, exchangeArray)
      
      if(availableStock){
        realtime_db.ref(`users/${req.user.handle}/portfolio/${req.body.symbol.replace(".", "~")}`).set({
          avg_price: new_avg_price,
          shares: new_share_count,
          currency: availableStock.currency
        }).then(() => {
          req.params.handle = req.user.handle;
          next();
        })
      }else{
        res.status(406).json({body: "Invalid stock symbol"})
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

var getMetrics = async function (req, res, next) {
  realtime_db
    .ref("users/" + req.params.handle).child('weekly_balances').get()
    .then(snapshot => {
      if (snapshot.exists()) {
        let history = snapshot.val()
        let historyArray = []

        //convert date into format: month day, year
        for(const date in history){
          const d = (new Date(parseInt(date))).toString().split(" ")
          historyArray.push({
            x: `${d[1]} ${d[2]}, ${d[3]}`,
            y: history[date]
          })
        }
        req.body.history = historyArray

      } else {
        req.body.history = []
      }
      next();
    }).catch((error) => {
      res.status(500).json({error})
    })
}


module.exports = {
  updateStock,
  deleteStock,
  getMetrics
}