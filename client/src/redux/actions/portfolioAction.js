import axios from 'axios';
import {
  LOADING_PORTFOLIO_DATA,
  SET_PORTFOLIO_DATA,
  POST_STOCK,
  LOADING_UI,
  SET_ERRORS
} from '../types';
import { clearErrors } from './dataAction'

// Get Portfolio Data: get any user data via "userHandle"
export const getPortfolioData = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_PORTFOLIO_DATA });
  axios
    .get(`/portfolio/${userHandle}`) //only need /posts since the base url in "proxy" in package.json
    .then((res) => {
      dispatch({
        type: SET_PORTFOLIO_DATA,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_PORTFOLIO_DATA,
        payload: {},
      });
    });
} 

export const postStock = (newStock) => (dispatch) => {
  dispatch({ type: LOADING_UI })
  axios.post('/portfolio', newStock)
    .then(res => {
      dispatch({ type: SET_PORTFOLIO_DATA, payload: res.data})
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({ type: SET_ERRORS, payload: err})
    })
}

export const deleteStock = (symbol) => (dispatch) => {
  dispatch({ type: LOADING_UI })
  axios.delete('/portfolio', {
    data: {symbol}
  })
    .then(res => {
      dispatch({ type: SET_PORTFOLIO_DATA, payload: res.data})
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({ type: SET_ERRORS, payload: err})
    })
}