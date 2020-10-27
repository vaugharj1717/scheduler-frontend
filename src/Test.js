import React, {useState} from 'react';
import './App.css';
import {Switch, Route, Link, Redirect} from 'react-router-dom';
import MeetingSchedulerPage from './meeting-scheduler-page/Meeting-Scheduler-Page.js';
import ViewSchedulePage from './view-schedule-page/View-Schedule-Page.js';
import AdminPage from './admin-page/Admin-Page.js';
import LoginPage from './login-page/Login-Page.js';
import {useSelector, useDispatch} from 'react-redux';
import {beginLoggingOut, beginRegistering, beginLoggingIn} from './actions.js';

function App() {
  const dispatch = useDispatch();
  let currentUser = useSelector(state => state.currentUser)
  // let currentUser = {role: "ADMIN"};
  let candidacy = useSelector(state => state.currentCandidacy);

  function logout(){
    dispatch(beginLoggingOut());
  }

  //REDIRECT TO LOGIN IF NOT LOGGED IN
  if(currentUser == null){
    return(
      <div>
        <Switch>
          <Route exact path="/test/login">
            <LoginPage/>
          </Route>
          <Route path="/test">
            <Redirect to="/test/login"/>
          </Route>
        </Switch>
      </div>
    )
  }

  else return (
    <div className="App">
        <Switch>

          {/*HOME SCREENS*/}
          <Route exact path="/test">
            {currentUser.role == 'SCHEDULER' && 
            <div>
              <div><Link to='test/meeting-scheduler'>To Meeting Scheduler Page</Link></div> 
              <button onClick={logout}>Logout</button> 
            </div>
            }  

            {currentUser.role == 'ADMIN' && 
            <div>
              <div><Link to='test/admin'>To Admin Page</Link></div> 
              <button onClick={logout}>Logout</button> 
            </div>
            }  

            {currentUser.role == 'PARTICIPANT' && 
            <div>
              <div><Link to='test/participant'>To Participant Page</Link></div> 
              <button onClick={logout}>Logout</button> `
            </div>
            }  

            {currentUser.role == 'CANDIDATE' && 
            <div>
              <div><Link to='test/candidate'>To Candidate Page</Link></div> 
              <button onClick={logout}>Logout</button> `
            </div>
            }             
          </Route>

          {/*SCHEDULER PAGES*/}
          <Route exact path="test/meeting-scheduler">
            {currentUser.role == 'SCHEDULER' ?
            <MeetingSchedulerPage user={currentUser}></MeetingSchedulerPage>
            :
            <Redirect to="/test"/>
            }
          </Route>

          <Route exact path="/test/meeting-scheduler/view-schedule">
            {currentUser.role == 'SCHEDULER' ?
            <ViewSchedulePage user={currentUser} candidacy = {candidacy}></ViewSchedulePage>
            :
            <Redirect to="/test"/>
            }
          </Route>

          {/*ADMIN PAGES*/}
          <Route exact path="/test/admin">
            {currentUser.role == 'ADMIN' ?
            <AdminPage user={currentUser} />
            :
            <Redirect to="/test"/>
            }
          </Route>

          {/*Redirect to home page if no match*/}
          <Route path="/test">
            <Redirect to="/test"></Redirect>
          </Route>
        </Switch>
    </div> 
  );
}

export default App;
