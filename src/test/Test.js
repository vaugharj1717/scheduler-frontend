import React, {useState} from 'react';
import {Switch, Route, Link, Redirect} from 'react-router-dom';
// import './Test.css'
import MeetingSchedulerPage from './meeting-scheduler-page/Meeting-Scheduler-Page.js';
import MessagingPane from './messaging-pane/Messaging-Pane.js';
import ViewSchedulePage from './view-schedule-page/View-Schedule-Page.js';
import ViewMeetingsPage from './view-meetings-page/View-Meetings-Page.js';
import AdminPage from './admin-page/Admin-Page.js';
import LoginPage from './login-page/Login-Page.js';
import FilePane from './file-pane/File-Pane.js';
import UserInfoPane from './user-info-pane/User-Info-Pane.js';
import FeedbackPane from './feedback-pane/Feedback-Pane.js';
import Spinner from './spinner/Spinner.js';
import PositionWatcher from './map/PositionWatcher.js';
import Map from './map/Map.js';
import {useSelector, useDispatch} from 'react-redux';
import {beginLoggingOut, setIsViewingMessages, setIsViewingFiles, setIsViewingUser, setIsViewingFeedback} from '../actions.js';

function App() {
  const dispatch = useDispatch();
  let currentUser = useSelector(state => state.currentUser)
  // let currentUser = {role: "ADMIN"};
  let userToMessage = useSelector(state => state.userToMessage);
  let candidacy = useSelector(state => state.currentCandidacy);
  let position = useSelector(state => state.currentPosition);
  let selectedUser = useSelector(state => state.selectedUser);
  let showUnseenMessagesNotifier = useSelector(state => state.showUnseenMessagesNotifier);
  let isViewingMessages = useSelector(state => state.isViewingMessages);
  let isViewingFiles = useSelector(state => state.isViewingFiles);
  let isViewingUser = useSelector(state => state.isViewingUser);
  let isViewingFeedback = useSelector(state => state.isViewingFeedback);
  let isViewingMap = useSelector(state => state.isViewingMap);
  let userIdOfViewedFiles = useSelector(state => state.userIdOfViewedFiles);
  let userIdOfViewedUser = useSelector(state => state.userIdOfViewedUser);
  let meetingIdOfFeedback = useSelector(state => state.meetingIdOfFeedback);
  let isSpinning = useSelector(state => state.isSpinning);

  function logout(){
    dispatch(beginLoggingOut());
  }
  function viewMessages(){
    dispatch(setIsViewingMessages(true));
  }
  function viewFiles(id){
    dispatch(setIsViewingFiles(true, id));
  }
  function viewUserInfo(id){
    dispatch(setIsViewingUser(true, id));
  }

  //REDIRECT TO LOGIN IF NOT LOGGED IN
  if(currentUser == null){
    return(
      <div>
        {isSpinning &&
          <Spinner/>
        }
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
      <MessagingPane userToMessage = {userToMessage} />
      }
      {isViewingFiles &&
      <FilePane userIdOfViewedFiles={userIdOfViewedFiles}/>
      }
      {isViewingUser &&
      <UserInfoPane userId={userIdOfViewedUser} />
      }
      {isViewingFeedback &&
      <FeedbackPane meetingId={meetingIdOfFeedback} />
      }
      {isSpinning &&
      <Spinner/>
      }
      {isViewingMap &&
      <Map selectedUser={selectedUser}/>
      }
      <PositionWatcher/>

        <Switch>

          {/*HOME SCREENS*/}
          <Route exact path="/test">
            {currentUser.role == 'SCHEDULER' && 
              <Redirect to="/test/meeting-scheduler"/>
            }  

            {(currentUser.role == 'ADMIN' || currentUser.role == 'SUPER_ADMIN') && 
            <div>
              <Redirect to="/test/admin"/>
            </div>
            }  

            {currentUser.role == 'PARTICIPANT' && 
            <Redirect to="/test/participant"/>
            }  

            {currentUser.role == 'CANDIDATE' && 
            <Redirect to="/test/candidate"/>
            } 

            {currentUser.role == 'DEPARTMENT_ADMIN' && 
            <Redirect to="/test/department-admin"/>
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

          <Route exact path="/test/logout">
            <button onClick={()=>dispatch(beginLoggingOut())}>Logout</button>
          </Route>

          <Route exact path="/test/meeting-scheduler/view-schedule">
            {currentUser.role == 'SCHEDULER' ?
            <ViewSchedulePage user={currentUser} candidacy={candidacy} position={position}></ViewSchedulePage>
            :
            <Redirect to="/test"/>
            }
          </Route>

          
          {/*CANDIDATE*/}
          <Route exact path="/test/candidate">
            {currentUser.role == 'CANDIDATE' ?
            <ViewMeetingsPage viewingOther={false} mode='CANDIDATE' user={currentUser} />
            :
            <Redirect to="/test"/>
            }
          </Route>

          {/*PARTICIPANT*/}
          <Route exact path="/test/participant">
            {currentUser.role == 'PARTICIPANT' ?
            <ViewMeetingsPage viewingOther={false} mode='PARTICIPANT' user={currentUser} />
            :
            <Redirect to="/test"/>
            }
          </Route>

          {/*DEPARTMENT ADMIN*/}
          <Route exact path="/test/department-admin">
            {currentUser.role == 'DEPARTMENT_ADMIN' ?
            <ViewMeetingsPage viewingOther={false} mode='DEPARTMENT_ADMIN' user={currentUser} />
            :
            <Redirect to="/test"/>
            }
          </Route>

          <Route exact path="/test/department-admin/admin">
            {currentUser.role == 'DEPARTMENT_ADMIN' ?
            <AdminPage viewingOther={false} mode='DEPARTMENT_ADMIN' user={currentUser} />
            :
            <Redirect to="/test"/>
            }
          </Route>

          {/*ADMIN PAGES*/}
          <Route exact path="/test/admin">
            {(currentUser.role == 'ADMIN' || currentUser.role == 'SUPER_ADMIN') ?
            <AdminPage user={currentUser} />
            :
            <Redirect to="/test"/>
            }
          </Route>

          {/*SEE ALL MEETINGS FOR A USER */}
          <Route exact path="/test/user/view-all-meetings">
          {selectedUser !== null ?
          <ViewMeetingsPage viewingOther={selectedUser.id !== currentUser.id} mode={currentUser.role} user={selectedUser} />
          :
          <Redirect to="/test"></Redirect>
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
