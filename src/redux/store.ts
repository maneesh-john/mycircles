import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './reducers/rootReducer';
import Thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';

const logger = createLogger({
    // ...options
  });

export default createStore(rootReducer, applyMiddleware(logger, Thunk));