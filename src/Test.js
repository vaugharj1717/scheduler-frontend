import React, {useState} from 'react';
import './App.css';
import {Switch, Route, Link, Redirect} from 'react-router-dom';
import MeetingSchedulerPage from './meeting-scheduler-page/Meeting-Scheduler-Page.js';
import MessagingPane from './messaging-pane/Messaging-Pane.js';
import ViewSchedulePage from './view-schedule-page/View-Schedule-Page.js';
import AdminPage from './admin-page/Admin-Page.js';
import LoginPage from './login-page/Login-Page.js';
import {useSelector, useDispatch} from 'react-redux';
import {beginLoggingOut, setIsViewingMessages} from './actions.js';

function App() {
  const dispatch = useDispatch();
  let currentUser = useSelector(state => state.currentUser)
  // let currentUser = {role: "ADMIN"};
  let candidacy = useSelector(state => state.currentCandidacy);
  let showUnseenMessagesNotifier = useSelector(state => state.showUnseenMessagesNotifier);
  let isViewingMessages = useSelector(state => state.isViewingMessages);

  function logout(){
    dispatch(beginLoggingOut());
  }
  function viewMessages(){
    dispatch(setIsViewingMessages(true));
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
      {isViewingMessages && 
      <MessagingPane />
      }
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
              {showUnseenMessagesNotifier && <div>True</div>}
              {!showUnseenMessagesNotifier && <div>False</div>}
              <button onClick={viewMessages}>View Messages</button>
              <div><Link to='test/participant'>To Participant Page</Link></div> 
              <button onClick={logout}>Logout</button>
              
            </div>
            }  

            {currentUser.role == 'CANDIDATE' && 
            <div>
              {showUnseenMessagesNotifier && <div>True</div>}
              {!showUnseenMessagesNotifier && <div>False</div>}
              <button onClick={viewMessages}>View Messages</button>
              <div><Link to='/test/candidate'>To Candidate Page</Link></div> 
              <button onClick={logout}>Logout</button> `
            </div>
            }             
          </Route>

          {/*SCHEDULER PAGES*/}
          <Route exact path="/test/meeting-scheduler">
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
