import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import {applyMiddleware, createStore} from "redux";
import Info from "./reducers/Company";
import logger from "redux-logger";
import {Provider} from 'react-redux';


export const store = createStore(Info, applyMiddleware(logger));

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
