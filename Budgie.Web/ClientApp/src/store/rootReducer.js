import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authentication from './authentication/reducer';
import categories from './categories/reducer';
import budgets from './budgets/reducer';

const reducers = {
  categories,
  authentication,
  budgets
};

export const rootReducer = combineReducers({
  ...reducers,
  routing: routerReducer
});