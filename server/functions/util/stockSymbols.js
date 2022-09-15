const fs = require('fs');
const functions = require('firebase-functions');
const axios = require('axios');

const US =require('./stockArrays/US').stockArrayUS
const TO =require('./stockArrays/TO').stockArrayTO

function binarySearch(symbol, start, end, exchangeStocksArray){
  mid = Math.floor((start+end) / 2)

  // Base Condition
  if (start > end) return false

  if (exchangeStocksArray[mid].symbol===symbol) return exchangeStocksArray[mid]

  if(symbol > exchangeStocksArray[mid].symbol)
    return binarySearch(symbol, mid+1, end, exchangeStocksArray)
  else
    return binarySearch(symbol, start, mid-1, exchangeStocksArray)
}

//binarySearch("DND.TO", 0, TO.length-1, TO)

function getExchangeArray(exchange){
  return US;
}
// US, TO, V (tsx)
function getStockSymbolsArray(exchange){
  axios(`https://finnhub.io/api/v1/stock/symbol?exchange=${exchange}&token=${functions.config().finnhub.key}`)
  .then(response => {
      let arr = response.data.map(obj => {
        return {
          symbol: obj.symbol,
          currency: obj.currency
        }
      }).sort(compare)
      fs.writeFile(__dirname+"/stocks.txt", JSON.stringify(arr, null, 2), err => {
        if (err) console.log(err);
      });
  });
}

function compare( a, b ) {
  if ( a.symbol < b.symbol )
    return -1;

  if ( a.symbol > b.symbol )
    return 1;

  return 0;
}

// Manually run each exhange and copy and paste contents into stockArrays Folder
//getStockSymbolsArray("TO")

module.exports = {
  binarySearch,
  //stockArrayLength,
  getExchangeArray
}