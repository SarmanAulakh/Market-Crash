import {
  LOADING_PORTFOLIO_DATA,
  SET_PORTFOLIO_DATA,
  POST_STOCK
} from '../types';

const initialState = {
  portfolio: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_PORTFOLIO_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_PORTFOLIO_DATA:
      return {
          ...state,
          portfolio: action.payload,
          loading: false
        };
    case POST_STOCK:
      return {
        ...state,
        portfolio: action.payload,
        loading: false
      }
    default:
      return state;
  }
}




/**
 * if(Object.keys(state.portfolio.portfolio).length === 0){
        state.portfolio.portfolio.portfolioData = {} 
        state.portfolio.portfolio.portfolioData[action.payload.symbol]= {
          symbol: action.payload.symbol,
          shares: action.payload.shares,
          avg_price: action.payload.avg_price
        }
        return {
          ...state
        }
      }
      console.log('test2')
      console.log(state.portfolio.portfolio)
      let total_invested = 0;
      let total_current_value = 0;
      
      Object.entries(state.portfolio.portfolio.portfolioData).map(([symbol,stock])=> {
        console.log("test", state.portfolio.portfolio.portfolioData)
        const invested = stock.shares * stock.avg_price
        const current_value = stock.shares * stock.current_price

        if(symbol === action.payload.symbol){
          stock.shares = action.payload.shares
          stock.avg_price = action.payload.avg_price
          stock.total_value = current_value
          stock.total_gain = 100 * (current_value - invested) / invested
        }

        total_invested += invested
        total_current_value += current_value
      })
      
      console.log('test3')
      state.portfolio.portfolio.total_current_value = total_current_value
      state.portfolio.portfolio.total_invested = total_invested
      state.portfolio.portfolio.gain_percentage = 100 * (total_current_value - total_invested) / total_invested
 */
// state.portfolio.portfolio.portfolioData.forEach(stock => {
//   const invested = stock.shares * stock.avg_price
//   const current_value = stock.shares * stock.current_price

//   if(stock.symbol === action.payload.symbol){
//     stock.shares = action.payload.shares
//     stock.avg_price = action.payload.avg_price
//     stock.total_value = current_value
//     stock.total_gain = 100 * (current_value - invested) / invested
//   }

//   total_invested += invested
//   total_current_value += current_value
// })

// //TODO: do conversion server side
      // //converting data from object to array
      // let stocks = []
      // for(let stock in action.payload.portfolioData){
      //   if (action.payload.portfolioData.hasOwnProperty(stock)) {
      //     var obj = action.payload.portfolioData[stock];
      //     obj.symbol = stock;
      //     stocks.push(obj)
      //  }
      // }
      // action.payload.portfolioData = stocks
      // return {
      //   ...state,
      //   portfolio: action.payload,
      //   loading: false
      // };