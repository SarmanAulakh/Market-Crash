const { realtime_db } = require("../util/admin")
const functions = require('firebase-functions');
const axios = require('axios');

//! Change to websocket (read api) when real time data is required
exports.getPortfolioData = (req, res) => {
  let promises = []
  let portfolioData = {}
  //let weekly_balances = []
  let total_invested = 0
  let total_current_value = 0

  realtime_db.ref('users/' + req.params.handle + '/portfolio/').once("value", (snapshot) => {
    if (snapshot.exists()) {
      //weekly_balances = snapshot.weekly_balances
      
      snapshot.forEach(data => {
        const symbol = data.key;
        const db_data = data.val();
        const invested = db_data.avg_price * db_data.shares
        
        //RUN FOR LOCALHOST TESTING: firebase functions:config:get > .runtimeconfig.json
        promises.push(axios
          .get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${functions.config().finnhub.key}`)
          .then(response => {
            const current_value = response.data.c * db_data.shares;

            portfolioData[symbol] = {...db_data, 
              current_price: response.data.c,
              total_value: current_value,
              total_gain: 100 * (current_value - invested) / invested
            }

            total_current_value += current_value
            total_invested += invested
          })
          .catch(err => res.status(500).json({error: err})) 
        )
      })

      Promise.all(promises)
        .then(() => {
          res.status(200).json({
            portfolioData,
            total_invested,
            total_current_value,
            //weekly_balances,
            gain_percentage: 100 * (total_current_value - total_invested) / total_invested
          })
        })
        .catch(err => res.status(500).json({error: err}))

    } else {
      res.status(500).json({error: "No data available"})
    }
  })
}

// exports.deletePortfolioData = (req, res) => {
//   realtime_db.ref(`users/${req.user.handle}/portfolio/${req.body.symbol}`).remove()
//   res.status(200).json({
//     success: "successfully delete " + req.body.symbol
//   })
// }