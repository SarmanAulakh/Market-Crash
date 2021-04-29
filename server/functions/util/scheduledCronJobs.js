const functions = require('firebase-functions');
const { realtime_db } = require("../util/admin")
const axios = require('axios');

//10pm every day: https://man7.org/linux/man-pages/man5/crontab.5.html
exports.scheduledFunctionCrontab = functions.pubsub.schedule('0 22 * * *')
  .timeZone('America/New_York') 
  .onRun(async (context) => {
    let stocks = {}
    let data = {}

    try{
      await realtime_db.ref('users/').once("value", (snapshot) => {
          snapshot.forEach(user => {
              data[user.key] = user.val()
          })
      })

      /**
       * Go through each user and add the current stock price to "stocks". This way,
       * if multiple users have the same stocks in the portfolio, only a single request is needed per stock symbol
       */
      for(user in data){
        let balance = 0

        if(!data[user].weekly_balances)
          data[user].weekly_balances = {}

        for(symbol in data[user].portfolio){
          const shares = data[user].portfolio[symbol].shares

          if(stocks.hasOwnProperty(symbol)){
            balance += stocks[symbol] * shares
          } else {
            const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${functions.config().finnhub.key}`)
            const curr_price = response.data.c
            balance += curr_price * shares
            stocks[symbol] = curr_price
          }
        }

        data[user].weekly_balances[Date.now()] = balance.toFixed(2)
        await realtime_db.ref('users/'+user+'/weekly_balances/').set(data[user].weekly_balances)
      }
    }
    catch(err){
      console.log(err)
    }
    return null;
});