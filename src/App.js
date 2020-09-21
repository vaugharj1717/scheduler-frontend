import React from 'react';
import './App.css';
import {Switch, Route, Link} from 'react-router-dom';
import MeetingSchedulerPage from './meeting-scheduler-page/Meeting-Scheduler-Page.js'
import CreateCandidatePage from './choose-candidate-page/Choose-Candidate-Page.js'

<<<<<<< HEAD
function App() {
  return (
    <div className="App">
        
        <Switch>
          <Route exact path="/">
            <div><Link to='meeting-scheduler'>To Meeting Scheduler Page</Link></div>
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
=======
class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            positions: [],
            participants: []
        }
    }
    getPositionsByDepartement(id){
        let url ="http://localhost:8444/position/department/";
        url = url + id + '/position';
        fetch(url,{method: "GET"})
            .then(res => res.json())
            .then(data =>{
                this.setState({
                    positions: data
                });
            })
    }
    getAllParticipants(){
        let url ="http://localhost:8444/user/participant/";
        fetch(url,{method: "GET"})
            .then(res => res.json())
            .then(data =>{
                this.setState({
                    participants: data
                });
            })
    }
  render() {
      return (
          <div>
            <button onClick={()=>this.getPositionsByDepartement(1)}>getPositionsByDepartement</button>
              <button onClick={()=>this.getAllParticipants()}>getAllParticipants</button>
            <div>Hello, world!</div>
          </div>
        );
    }
>>>>>>> 97ce52da17a42a6c43853dd55a5cc2a6482e1f8f
}

export default App;
