import React from 'react';
import './App.css';

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            positions: []
        }
    }
    getPositionsByDepartement(id){
        let url ="http://localhost:8444/position/department/";
        url = url + id + '/position';
        fetch(url,{method: "GET"})
            .then(data =>{
                this.setState({
                    positions: data
                });
            })
    }
  render() {
      return (
          <div>
            <button onClick={()=>this.getPositionsByDepartement(1)}>getPositionsByDepartement</button>
            <div>Hello, world!</div>
          </div>
        );
    }
}

export default App;
