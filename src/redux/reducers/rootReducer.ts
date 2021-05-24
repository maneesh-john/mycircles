import { combineReducers } from 'redux';
import { appReducer } from './appReducer';
import { profileReducer } from './profileReducer';

export const rootReducer = combineReducers(
    {
        app: appReducer,
        profile: profileReducer
    }
);