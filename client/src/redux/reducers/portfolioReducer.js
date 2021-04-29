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