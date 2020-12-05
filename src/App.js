import React, {useState} from 'react';
import './App.css';
import {Switch, Route, Link, Redirect} from 'react-router-dom';
import Test from './test/Test.js';
// import LoginPage from './login-page/Login-Page.js';
import {beginLoggingOut} from './actions.js'
import {useSelector, useDispatch} from 'react-redux';

function App() {
  const dispatch = useDispatch();
  let currentUser = useSelector(state => state.currentUser)
  //let [creatingCandidate, setCreatingCandidate] = useState(false);
  //if new state depends on old state, pass function into it (toggle)
  //setCreatingCandidate(creatingCandidate => !creatingCandidate)

  {/* If user is logged in... */}
  return(
    <Test></Test>
  );
}

export default App;
