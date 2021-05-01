const { realtime_db, db } = require("../util/admin")
const functions = require('firebase-functions');
const axios = require('axios');

//! Change to websocket (read api) when real time data is required
exports.getPortfolioData = (req, res) => {
  let promises = []
  let portfolioData = {}
  let total_invested = 0
  let total_current_value = 0

  realtime_db.ref('users/' + req.params.handle + '/portfolio/').once("value", (snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach(data => {
        const symbol = data.key.replace("~", ".");
        const db_data = data.val();
        const USD_to_CAD = db_data.currency === "CAD" ? 1.24 : 1
        const invested = db_data.avg_price * db_data.shares * USD_to_CAD  //anything using db_data.avg_price * USD_TO_CAD

        promises.push(axios
          .get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${functions.config().finnhub.key}`)
          .then(response => {
            const current_value = response.data.c * db_data.shares;

            portfolioData[symbol] = {
              avg_price: db_data.avg_price * USD_to_CAD,
              shares: db_data.shares, 
              current_price: response.data.c,
              total_value: current_value,
              total_gain: 100 * (current_value - invested) / invested,
              currency: db_data.currency
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
            gain_percentage: 100 * (total_current_value - total_invested) / total_invested,
            history: req.body.history || []
          })
        })
        .catch(err => res.status(500).json({error: err}))

    } else {
      res.status(200).json({msg: "No data available"})
    }
  })
}
