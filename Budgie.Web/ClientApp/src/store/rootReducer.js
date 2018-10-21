import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authentication from './authentication/reducer';
import categories from './categories/reducer';

const reducers = {
  categories,
  authentication
};

export const rootReducer = combineReducers({
  ...reducers,
  routing: routerReducer
});