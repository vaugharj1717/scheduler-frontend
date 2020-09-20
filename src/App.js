import React from 'react';
import './App.css';

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
}

export default App;
