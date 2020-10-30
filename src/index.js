import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import {Provider} from 'react-redux';
import storeExport from './store.js';
import {BrowserRouter} from 'react-router-dom'
import {PersistGate} from 'redux-persist/integration/react'
import MessageChecker from './message-checker/Message-Checker.js'
import store from './store.js';

let storeExportVals = storeExport();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={storeExportVals.store}>
      <PersistGate loading={null} persistor={storeExportVals.persistor}>
        <BrowserRouter>
          <MessageChecker/>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
