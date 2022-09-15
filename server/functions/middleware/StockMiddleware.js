const { realtime_db } = require("../util/admin")
const { binarySearch, getExchangeArray } = require("../util/stockSymbols")
const FBAuth = require("../util/fbAuth")

var updateStock = {
  requireAuthentication: FBAuth,
  update: function(req, res, next) {
      const new_avg_price = ((req.body.current_data.avg_price*req.body.current_data.shares) + (req.body.price*req.body.shares))/(req.body.current_data.shares+req.body.shares)
      const new_share_count = req.body.current_data.shares + req.body.shares
      
      const exchangeArray = getExchangeArray(req.body.exchange)
      // const availableStock = binarySearch(req.body.symbol, 0, exchangeArray.length-1, exchangeArray)
      
      if(exchangeArray.indexOf(req.body.symbol)){
        realtime_db.ref(`users/${req.user.handle}/portfolio/${req.body.symbol.replace(".", "~")}`).set({
          avg_price: new_avg_price,
          shares: new_share_count,
          currency: 'USD'
        }).then(() => {
          req.params.handle = req.user.handle;
          next();
        }).catch(e => console.error(e));
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
      }).catch(e => console.error(e));
  }
}

var getMetrics = async function (req, res, next) {
  realtime_db
    .ref("users/" + req.params.handle).child('weekly_balances').get()
    .then(snapshot => {
      if (snapshot.exists()) {
        let history = snapshot.val()
        let historyArray = []

        let count = 0;

        // lat 30 days only
        const reversedKeys = Object.keys(history).reverse().slice(0, 31);

        reversedKeys.forEach(date => {
          const d = (new Date(parseInt(date))).toString().split(" ")
            historyArray.push({
              x: `${d[1]} ${d[2]}, ${d[3]}`,
              y: history[date]
            })
        });

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