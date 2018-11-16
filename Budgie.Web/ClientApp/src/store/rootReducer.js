import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authentication from './authentication/reducer';
import categories from './categories/reducer';
import budget from './budget/reducer';

const reducers = {
  categories,
  authentication,
  budget
};

export const rootReducer = combineReducers({
  ...reducers,
  routing: routerReducer
});