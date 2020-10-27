import React, {useState} from 'react';
import './App.css';
import {Switch, Route, Link, Redirect} from 'react-router-dom';
import Test from './Test.js';
import MeetingSchedulerPage from './meeting-scheduler-page/Meeting-Scheduler-Page.js';
import ViewSchedulePage from './view-schedule-page/View-Schedule-Page.js';
import AdminPage from './admin-page/Admin-Page.js';
import LoginPage from './login-page/Login-Page.js';
import {useSelector, useDispatch} from 'react-redux';
import {beginLoggingOut, beginRegistering, beginLoggingIn} from './actions.js';

function App() {
  return(
    <div>
    <Switch>
          <Route path="/test">
            <Test></Test>
          </Route>
          <Route exact path="/">
            <Link to="/test">TEST</Link>
          </Route>
    </Switch>
    </div>
  );
}

export default App;
