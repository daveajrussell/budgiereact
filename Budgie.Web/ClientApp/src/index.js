import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Router } from 'react-router-dom';
import App from './App';

// Redux Store
import { Provider } from 'react-redux';
import { configureStore } from './store'
import { history } from './store/history';

// Settings
import accounting from 'accounting';

import './index.scss';

accounting.settings = {
  currency: {
    symbol: "£",   // default currency symbol is '$'
    format: "%s%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
    decimal: ".",  // decimal point separator
    thousand: ",",  // thousands separator
    precision: 2   // decimal places
  },
  number: {
    precision: 0,  // default precision on numbers is 0
    thousand: ",",
    decimal: "."
  }
}

const store = configureStore();

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
), document.getElementById('root'))
registerServiceWorker()