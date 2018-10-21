import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Router } from 'react-router-dom';
import App from './App';

// Redux Store
import { Provider } from 'react-redux';
import { configureStore } from './store'
import { history } from './store/history';

import './index.scss';

const store = configureStore();

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
), document.getElementById('root'))
registerServiceWorker()