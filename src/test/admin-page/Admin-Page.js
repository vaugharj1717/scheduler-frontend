import React, {useEffect, useState} from 'react';
import './Admin-Page.css';
import {Switch, Route, Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {beginGettingUsers, beginGettingLocations, beginGettingDepartments, beginDeletingLocation, beginDeletingUser,
beginDeletingDepartment, beginCreatingUser, beginCreatingLocation, beginCreatingDepartment, beginChangingRole} from '../../actions.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {makeStyles, createMuiTheme} from "@material-ui/core/styles";

export default function AdminPage(props){
    const dispatch = useDispatch();
    let users = useSelector(state => state.users);
    // let users = [{id: 1, name: "testName", email: "testEmail", role: "CANDIDATE"}];
    let locations = useSelector(state => state.locations);
    // let locations = [{id: 2, buildingName: "testBuildingName", roomNumber: "testRoomNumber"}];
    let departments = useSelector(state => state.departments);
    // let departments = [{id: 3, departmentName: "testDepartmentName"}];

    let [usersState, setUsersState] = useState(users);
    let [selectedView, setSelectedView] = useState("user");
    let [creatingNew, setCreatingNew] = useState(false);
    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [role, setRole] = useState("PARTICIPANT");
    let [departmentName, setDepartmentName] = useState("");
    let [buildingName, setBuildingName] = useState("");
    let [roomNumber, setRoomNumber] = useState("");


    useEffect(()=>{
        dispatch(beginGettingUsers());
        dispatch(beginGettingLocations());
        dispatch(beginGettingDepartments())
    }, []);

    function resetPageState(){
        setName("");
        setEmail("");
        setRole("PARTICIPANT");
        setDepartmentName("");
        setBuildingName("");
        setRoomNumber("");
        setCreatingNew(false);
    }


    function handleCreateNew(value){
        setCreatingNew(value);

    }

    function handleViewChange(view){
        setSelectedView(view);
        resetPageState();
    }

    function handleRoleClick(index, role){
        setUsersState(userState => {
            userState[index].role = role;
            return userState;
        })
    }

    function handleRoleChange(id, role){
        console.log(`ID: ${id}, ROLE: ${role}`);
        dispatch(beginChangingRole(id, role));
    }

    function handleCreateDepartment(){
        dispatch(beginCreatingDepartment(departmentName));
        resetPageState();
    }

    function handleDeleteDepartment(departmentId){
        dispatch(beginDeletingDepartment(departmentId));
        resetPageState();
    }

    function handleCreateUser(){
        dispatch(beginCreatingUser(name, email, role));
        resetPageState();
    }

    function handleDeleteUser(userId){
        dispatch(beginDeletingUser(userId));
        resetPageState();
    }
    
    function handleCreateLocation(){
        dispatch(beginCreatingLocation(buildingName, roomNumber));
        resetPageState();
    }

    function handleDeleteLocation(locationId){
        dispatch(beginDeletingLocation(locationId));
        resetPageState();
    }

    function handleNameChange(name){
        setName(name);
    }
    function handleEmailChange(email){
        setEmail(email);
    }
    function handleBuildingNameChange(buildingName){
        setBuildingName(buildingName);
    }
    function handleRoomNumberChange(roomNumber){
        setRoomNumber(roomNumber);
    }
    function handleDepartmentNameChange(departmentName){
        setDepartmentName(departmentName);
    }

    if(selectedView === "user") return(
        <div>
            <div id="admin-header">ADMINISTRATOR</div>
            <div id="admin-nav">
                <button onClick={()=>handleViewChange("user")} className="admin-nav-btn admin-nav-btn-left">USERS</button>
                <button onClick={()=>handleViewChange("location")}className="admin-nav-btn">LOCATIONS</button>
                <button onClick={()=>handleViewChange("department")}className="admin-nav-btn admin-nav-btn-right">DEPARTMENTS</button>
            </div>
            <div id="admin-content-wrap">
                <button onClick={()=>handleCreateNew(true)} id="admin-content-create-btn">Create New</button>
                <div id="admin-content">
                    <div id="admin-content-header">Users</div>
                    {creatingNew && 
                    <div id="admin-create-new">
                        <div id="admin-create-new-text">
                            <label>Name: <input type="text" value={name} onChange={e=>handleNameChange(e.target.value)} /></label>
                            <label>Email: <input type="text" value={email} onChange={e=>handleEmailChange(e.target.value)} /></label>
                        </div>
                        <div onChange={(e)=>setRole(e.target.value)} id="admin-create-new-roles">
                            <input type="radio" value="PARTICIPANT" name="newRole" checked={role === "PARTICIPANT"} /> Participant
                            <input type="radio" value="CANDIDATE" name="newRole" checked={role === "CANDIDATE"}/> Candidate
                            <input type="radio" value="SCHEDULER" name="newRole" checked={role === "SCHEDULER"}/> Scheduler
                            <input type="radio" value="DEPARTMENT_ADMIN" name="newRole" checked={role === "DEPARTMENT_ADMIN"}/> Department Admin
                            <input type="radio" value="ADMIN" name="newRole" checked={role === "ADMIN"}/> Admin
                        </div>
                        <div>
                        <button onClick={()=>handleCreateUser()}>Create</button>
                        <button onClick={()=>setCreatingNew(false)}>Cancel</button>
                        </div>
                    </div>   
                    }
                    {users.map((user, i) => (
                        <div className="userRow" key={i}>
                            <button onClick={()=>handleDeleteUser(user.id)} className="admin-user-delete-btn">DELETE</button>
                            <span className="admin-row-info admin-user-name">{user.name}</span>
                            <span className="admin-row-info admin-user-email">{user.email}</span>
                            <span className="admin-row-info admin-user-role">{user.role}</span>
                            {/* <span onChange={(e)=>handleRoleChange(user.id, e.target.value)} className="admin-user-role-btn-grp">
                                <input type="radio" onClick={(e)=>handleRoleClick(i, e.target.value)} value='PARTICIPANT' id={`participant${i}`} name={`role${i}`} checked={users[i].role=='PARTICIPANT'} />
                                <label htmlFor={`participant${i}`}>Participant</label>
                                <input type="radio" onClick={(e)=>handleRoleClick(i, e.target.value)} value='CANDIDATE' id={`candidate${i}`} name={`role${i}`} checked={users[i].role=='CANDIDATE'}  />
                                <label htmlFor={`candidate${i}`}>Candidate</label>
                                <input type="radio" onClick={(e)=>handleRoleClick(i, e.target.value)} value='SCHEDULER' id={`scheduler${i}`} name={`role${i}`} checked={users[i].role=='SCHEDULER'}  />
                                <label htmlFor={`scheduler${i}`}>Scheduler</label>
                                <input type="radio" onClick={(e)=>handleRoleClick(i, e.target.value)} value='DEPARTMENT_ADMIN' id={`departmentAdmin${i}`} name={`role${i}`} checked={users[i].role=='DEPARTMENT_ADMIN'}  />
                                <label htmlFor={`departmentAdmin${i}`}>Department Admin</label>
                                <input type="radio" onClick={(e)=>handleRoleClick(i, e.target.value)} value='ADMIN' id={`admin${i}`} name={`role${i}`} checked={users[i].role=='ADMIN'}  />
                                <label htmlFor={`admin${i}`}>Admin</label>
                            </span> */}
                        </div> 
                    ))}
                </div>
            </div>
        </div>
    )

    else if(selectedView === "location") return(
        <div>
            <div id="admin-header">ADMINISTRATOR</div>
            <div id="admin-nav">
                <button onClick={()=>handleViewChange("user")} className="admin-nav-btn admin-nav-btn-left">USERS</button>
                <button onClick={()=>handleViewChange("location")}className="admin-nav-btn">LOCATIONS</button>
                <button onClick={()=>handleViewChange("department")}className="admin-nav-btn admin-nav-btn-right">DEPARTMENTS</button>
            </div>
            <div id="admin-content-wrap">
                <button onClick={()=>handleCreateNew(true)} id="admin-content-create-btn">Create New</button>
                <div id="admin-content">
                    <div id="admin-content-header">Locations</div>
                    {creatingNew && 
                    <div id="admin-create-new">
                        <div id="admin-create-new-text">
                            <label>Building: <input type="text" value={buildingName} onChange={e=>handleBuildingNameChange(e.target.value)} /></label>
                            <label>Room #: <input type="text" value={roomNumber} onChange={e=>handleRoomNumberChange(e.target.value)} /></label>
                        </div>
                        <div>
                            <button onClick={()=>handleCreateLocation()}>Create</button>
                            <button onClick={()=>setCreatingNew(false)}>Cancel</button>
                        </div>
                    </div>   
                    }
                    {locations.map((location, i) => (
                        <div className="userRow" key={i}>
                            <button onClick={()=>handleDeleteLocation(location.id)} className="admin-user-delete-btn">DELETE</button>
                            <span className="admin-row-info admin-user-name">{location.buildingName}</span>
                            <span className="admin-row-info admin-user-email">{location.roomNumber}</span>
                        </div> 
                    ))}
                </div>
            </div>
        </div>
    )

    else if(selectedView === "department") return(
        <div>
            <div id="admin-header">ADMINISTRATOR</div>
            <div id="admin-nav">
                <button onClick={()=>handleViewChange("user")} className="admin-nav-btn admin-nav-btn-left">USERS</button>
                <button onClick={()=>handleViewChange("location")}className="admin-nav-btn">LOCATIONS</button>
                <button onClick={()=>handleViewChange("department")}className="admin-nav-btn admin-nav-btn-right">DEPARTMENTS</button>
            </div>
            <div id="admin-content-wrap">
                <button onClick={()=>handleCreateNew(true)} id="admin-content-create-btn">Create New</button>
                <div id="admin-content">
                    <div id="admin-content-header">Departments</div>
                    {creatingNew && 
                    <div id="admin-create-new">
                        <div id="admin-create-new-text">
                            <label>Department Name: <input type="text" value={departmentName} onChange={e=>handleDepartmentNameChange(e.target.value)} /></label>
                        </div>
                        <div>
                            <button onClick={()=>handleCreateDepartment()}>Create</button>
                            <button onClick={()=>setCreatingNew(false)}>Cancel</button>
                        </div>
                    </div>   
                    }
                    {departments.map((department, i) => (
                        <div className="userRow" key={i}>
                            <button onClick={()=>handleDeleteDepartment(department.id)} className="admin-user-delete-btn">DELETE</button>
                            <span className="admin-row-info admin-user-name">{department.departmentName}</span>
                        </div> 
                    ))}
                </div>
            </div>
        </div>
    )


    
}