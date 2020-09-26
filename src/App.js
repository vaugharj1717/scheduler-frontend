import React from 'react';
import {useDispatch} from 'react-redux';
import './App.css';
import {Switch, Route, Link} from 'react-router-dom';
import MeetingSchedulerPage from './meeting-scheduler-page/Meeting-Scheduler-Page.js';
import CreateCandidatePage from './choose-candidate-page/Choose-Candidate-Page.js';
import {beginGettingPositions} from './actions.js';

function App() {
  const dispatch = useDispatch();
  
  return (
    <div className="App">
        
        <Switch>
          <Route exact path="/">
            <div><Link to='meeting-scheduler' onClick={(e) => handleMeetingScheduleLinkClick()}>To Meeting Scheduler Page</Link></div>
            <div><Link to='meeting-scheduler/create-candidate'>To Create Candidate Page</Link></div>
          </Route>
          <Route exact path="/meeting-scheduler">
            <MeetingSchedulerPage></MeetingSchedulerPage>
          </Route>
          <Route exact path="/meeting-scheduler/create-candidate">
            <CreateCandidatePage></CreateCandidatePage>
          </Route>
        </Switch>
    </div> 
  );
}

export default App;
