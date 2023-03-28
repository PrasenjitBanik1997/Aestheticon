import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from "./store/reducers/Index";
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { PersistGate } from 'redux-persist/integration/react';


const persistConfig = {
  key: 'main-root',
  storage: storage,
}


const composeEnhancers = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose;
const pReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(pReducer, composeEnhancers(applyMiddleware(thunk)))
const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
