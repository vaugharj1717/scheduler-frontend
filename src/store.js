import {createStore, applyMiddleware} from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk';
import reducer from './reducer';

//const store = createStore(reducer, applyMiddleware(thunk));
//export default store;


const persistConfig = {
    key: 'root',
    storage,
  }
   
  const persistedReducer = persistReducer(persistConfig, reducer)
   
  export default () => {
    let store = createStore(persistedReducer, applyMiddleware(thunk));
    let persistor = persistStore(store)
    return { store, persistor }
  }