const functions = require('firebase-functions');
const { realtime_db } = require("../util/admin")
const axios = require('axios');

//10pm every saturday: https://man7.org/linux/man-pages/man5/crontab.5.html
exports.scheduledFunctionCrontab = functions.pubsub.schedule('0 22 * * sat')
  .timeZone('America/New_York') 
  .onRun((context) => {
    let promises = []
    let all_balances = []

    realtime_db.ref('users/').on("value", (snapshot) => {
        snapshot.forEach(user => {
          let balance = 0;

          user.portfolio.forEach(stock => {
            const symbol = stock.key;
            const db_data = stock.val();

            promises.push(axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${functions.config().finnhub.key}`)
              .then(response => { 
                balance += response.data.c * db_data.shares 
              })
            )
          })

          all_balances.push({
            user: user.key,
            balance: balance,
            old_balances: user.weekly_balances || []
          })
        })
        Promise.all(promises).then(() => {
          all_balances.forEach(data => {
            data.old_balances.push(data.balance);
    
            realtime_db.ref(`users/${data.user}`).set({
              weekly_balances: data.old_balances
            })
          })
        })
        return null;
    })
    
});