import React, {useState} from 'react';
import './App.css';
import {Switch, Route, Link, Redirect} from 'react-router-dom';
import Test from './test/Test.js';
import {useSelector, useDispatch} from 'react-redux';

function App() {
  const dispatch = useDispatch();
  let currentUser = useSelector(state => state.currentUser)

  {/* If user is not logged in... */}
  if(currentUser == null){
    return(
      <div>
        <Switch>
          <Route exact path="/login">
            {/* <LoginPage /> goes here */}
          </Route>

          {/* Redirect user to /login if not logged in */}
          <Route path="/">
            <Redirect to="/login"/>
          </Route>
        </Switch>
      </div>
    )
  }

  {/* If user is logged in... */}
  return(
    <div>
    <Switch>
          {/*OLD CODE: To visit old code uncomment the block below */}
          
          {/* <Route path="/test">
            <Test></Test>
          </Route>
          <Route exact path="/">
            <Link to="/test">TEST</Link>
          </Route> */}


          {/*NEW CODE: This is the root of the project (ignoring index.js, which is config stuff) */}
          <Route exact path="/">
            {currentUser.role === 'SCHEDULER' && 
            <div>
              {/* <ComponentGoesHere mode='SCHEDULER' /> */}
            </div>
            }

            {currentUser.role === 'PARTICIPANT' && 
            <div>
              {/* <ComponentGoesHere mode='PARTICIPANT' /> */}
            </div>
            }

            {currentUser.role === 'CANDIDATE' && 
            <div>
              {/* <ComponentGoesHere mode='CANDIDATE' /> */}
            </div>
            }

            {currentUser.role === 'ADMIN' && 
            <div>
              {/* <ComponentGoesHere mode='ADMIN' /> */}
            </div>
            }
          </Route>
    </Switch>
    </div>
  );
}

export default App;
