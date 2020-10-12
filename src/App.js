import React from 'react';
import './App.css';
import {Switch, Route, Link} from 'react-router-dom';
import MeetingSchedulerPage from './meeting-scheduler-page/Meeting-Scheduler-Page.js';
import ViewSchedulePage from './view-schedule-page/View-Schedule-Page.js';
import {useSelector, useDispatch} from 'react-redux';

function App() {
  let candidacy = useSelector(state => state.currentCandidacy);
  return (
    <div className="App">
        <Switch>
          <Route exact path="/">
            <div><Link to='meeting-scheduler'>To Meeting Scheduler Page</Link></div>
          </Route>
          <Route exact path="/meeting-scheduler">
            <MeetingSchedulerPage></MeetingSchedulerPage>
          </Route>
          <Route exact path="/meeting-scheduler/view-schedule">
            <ViewSchedulePage candidacy = {candidacy}></ViewSchedulePage>
          </Route>
        </Switch>
    </div> 
  );
}

export default App;
