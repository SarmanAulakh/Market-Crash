import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

// Reducers
import userReducer from './reducers/userReducer'
import dataReducer from './reducers/dataReducer'
import uiReducer from './reducers/uiReducer'

const initialState = {}

// We spread the middleware array in applyMiddleware(...middleware).
// However, since there is currently only 1 middleware (thunk), 
// we can skip this and do applyMiddleware(thunk) below
const middleware = [thunk]  

const reducers = combineReducers({
  user: userReducer,
  data: dataReducer,
  UI: uiReducer
});

// Used to see data in Redux Devtools Extension
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));

const store = createStore(reducers, initialState, enhancer);

export default store;