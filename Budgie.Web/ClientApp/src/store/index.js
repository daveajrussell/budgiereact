import { compose, createStore, applyMiddleware } from 'redux';
import { rootReducer } from './rootReducer';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';

export function configureStore() {
    const middleware = [
        thunk,
        reduxImmutableStateInvariant()
    ];

    const enhancers = [];
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
        enhancers.push(window.devToolsExtension());
    }

    return createStore(
        rootReducer,
        compose(applyMiddleware(...middleware), ...enhancers)
    )
}