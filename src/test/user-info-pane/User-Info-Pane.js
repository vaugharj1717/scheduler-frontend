import React, {useEffect, useState} from 'react';
import './User-Info-Pane.css';
import {useSelector, useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import {beginGettingDepartments, setMap, setCandidateAlerts, setIsViewingUser, beginGettingUser, selectUser, setUserToMessage,
    setIsViewingFiles, beginUpdatingUserInfo, beginUpdatingPassword, setIsViewingMessages} from '../../actions.js';
import {makeStyles, createMuiTheme} from "@material-ui/core/styles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';





    const useStyles = makeStyles({
        root: {
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
            color: "white",
          },
          "& .MuiOutlinedInput-input": {
            color: "white"
          },
          "& .MuiInputLabel-outlined": {
            color: "white"
          },
          "& .MuiAutocomplete-popupIndicator": {
            color: "white",
          },
          "& .MuiAutocomplete-clearIndicator": {
              color: "white"
          },
          color: "white !important",
          borderWidth: '1px',
          borderColor: "white !important",
        }
    })

function UserInfoPane(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    let currentUser = useSelector(state => state.currentUser);
    let viewedUser = useSelector(state => state.viewedUser);
    let errorMessage = useSelector(state => state.errorMessage);
    let userId = props.userId
    let [isEditing, setIsEditing] = useState(false);
    let [isChangingPassword, setIsChangingPassword] = useState(false);
    let [name, setName] = useState(viewedUser.name);
    let [email, setEmail] = useState(viewedUser.email);
    let [address, setAddress] = useState(viewedUser.address);
    let [phone, setPhone] = useState(viewedUser.phone);
    let [university, setUniversity] = useState(viewedUser.university);
    let [bio, setBio] = useState(viewedUser.bio);
    let [oldPass, setOldPass] = useState('');
    let [newPass, setNewPass] = useState('');
    let [newPassRep, setNewPassRep] = useState('');
    let departments = useSelector(state => state.departments);
    let [selectedDepartment, setSelectedDepartment] = useState(null);




    useEffect(()=>{
        dispatch(beginGettingUser(userId));
        dispatch(beginGettingDepartments());
    }, []);

    function handleViewAllMeetings(user){
        dispatch(setIsViewingUser(false));
        dispatch(selectUser(user));
    }
    function handleViewFiles(){
        dispatch(setIsViewingFiles(true, viewedUser.id));
    }

    function handleEdit(){
        if(viewedUser.department === null){
            setSelectedDepartment(null)
        }
        else setSelectedDepartment(viewedUser.department);
        if(viewedUser.name === null)
            setName('');
        else setName(viewedUser.name);
        if(viewedUser.email === null)
            setEmail('');
        else setEmail(viewedUser.email);
        if(viewedUser.address === null)
            setAddress('');
        else setAddress(viewedUser.address);
        if(viewedUser.phone === null)
            setPhone('');
        else setPhone(viewedUser.phone);
        if(viewedUser.university === null)
            setUniversity('');
        else setUniversity(viewedUser.university);
        if(viewedUser.bio === null)
            setBio('');
        else setBio(viewedUser.bio);
        setIsEditing(true);
    }

    function handleSave(){
        let departmentId = null;
        if((currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN') && selectedDepartment !== null && selectedDepartment !== undefined)
            departmentId = selectedDepartment.id;
        else if(currentUser.department !== null)
            departmentId = currentUser.department.id;
        dispatch(beginUpdatingUserInfo(userId, name, email, address, phone, university, bio, departmentId));
        setIsEditing(false);
    }

    function handleUpdatePassword(){
        dispatch(beginUpdatingPassword(userId, oldPass, newPass, newPassRep));
        setOldPass("");
        setNewPass("");
        setNewPassRep("");
    }

    if(!isEditing && !isChangingPassword) return(
        <div id="user-info-darken-background">
        <div id="user-info-pane-root">
            <div id="user-info-pane-header">User Info</div>
            <div onClick={()=> dispatch(setIsViewingUser(false))} id="user-info-pane-exit">X</div>
            <div id="user-info-pane-container">
                {(currentUser.id === viewedUser.id || currentUser.role === "ADMIN" || currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'SCHEDULER' || (currentUser.role === 'DEPARTMENT_ADMIN' && (viewedUser.role === 'CANDIDATE' || viewedUser.department === currentUser.department)) ) &&
                <button className="user-info-edit-btn" onClick={()=>handleEdit()}>Edit</button>
                }
                {currentUser.id === viewedUser.id &&
                <button className="user-info-edit-btn" onClick={()=>setIsChangingPassword(true)}>Change Password</button>
                }
                {currentUser.id === viewedUser.id && viewedUser.alert && viewedUser.role === 'CANDIDATE' && 
                <button className="user-info-edit-btn" onClick={()=>dispatch(setCandidateAlerts(currentUser.id, false))}>Turn off Alerts</button>
                }
                {currentUser.id === viewedUser.id && !viewedUser.alert && viewedUser.role === 'CANDIDATE' && 
                <button className="user-info-edit-btn" onClick={()=>dispatch(setCandidateAlerts(currentUser.id, true))}>Turn on Alerts</button>
                }
                {currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN' && currentUser.id !== viewedUser.id && 
                <button className="user-info-edit-btn" onClick={()=>{dispatch(setUserToMessage(viewedUser)); dispatch(setIsViewingMessages(true))}}>Message</button>
                }
                {currentUser.id !== viewedUser.id &&
                <button className="user-info-edit-btn" onClick={()=>dispatch(setMap(true, false))}>See location</button>
                }
                
                <div className="user-info-item">
                    <span className="user-info-label">Name:</span> 
                    <span className="user-info-data">{viewedUser.name}</span>
                </div>
                <div className="user-info-item">
                    <span className="user-info-label">Email:</span> 
                    <span className="user-info-data">{viewedUser.email}</span>
                </div>
                {(viewedUser.department !== null && viewedUser.department !== undefined) ?
                <div className="user-info-item">
                    <span className="user-info-label">Department:</span> 
                    <span className="user-info-data">{viewedUser.department.departmentName}</span>
                </div>
                :
                viewedUser.role === 'CANDIDATE' ?
                <div></div>
                :
                <div className="user-info-item">
                    <span className="user-info-label">Department:</span> 
                    <span className="user-info-data">N/A</span>
                </div>
                }
                
                <div className="user-info-item">
                    <span className="user-info-label">Address:</span> 
                    <span className="user-info-data">{viewedUser.address}</span>
                </div>
                <div className="user-info-item">
                    <span className="user-info-label">Phone:</span> 
                    <span className="user-info-data">{viewedUser.phone}</span>
                </div>
                <div className="user-info-item">
                    <span className="user-info-label">Graduated from:</span> 
                    <span className="user-info-data">{viewedUser.university}</span>
                </div>
                <div className="user-info-item">
                    <span className="user-info-label">Uploaded Files:</span> 
                    <span onClick={handleViewFiles} className="user-info-data link-to-files">Click to view</span>
                </div>
                {((viewedUser.role === 'PARTICIPANT' || viewedUser.role === 'CANDIDATE' || viewedUser.role === 'DEPARTMENT_ADMIN') && currentUser.role !== 'CANDIDATE') &&
                <div className="user-info-item">
                    <span className="user-info-label">View all meetings:</span> 
                    <Link to="/test/user/view-all-meetings" className="user-info-data link-to-files" onClick={()=>handleViewAllMeetings(viewedUser)}>Click to view</Link>
                </div>
                }
                <div className="user-info-item">
                    <span className="user-info-label">About:</span> 
                    {viewedUser.bio !== null && viewedUser.bio !== undefined &&
                    <div className="user-info-data">{viewedUser.bio.split('\n').map(str => <p className="bio-para">{str}</p>)}</div>
                    }
                </div>
            </div>
        </div>
        </div>
    )
    else if (isEditing) return(
        <div id="user-info-darken-background">
        <div id="user-info-pane-root">
            <div id="user-info-pane-header">User Info</div>
            <div onClick={()=> dispatch(setIsViewingUser(false))} id="user-info-pane-exit">X</div>
            <div id="user-info-pane-container">
                <button className="user-info-edit-btn" onClick={()=>setIsEditing(false)}>Cancel</button>
                <button className="user-info-save-btn" onClick={handleSave}>Save</button>
                <div className="user-info-item">
                    <span className="user-info-label">Name:</span> 
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="user-info-input" />
                </div>
                <div className="user-info-item">
                    <span className="user-info-label">Email:</span> 
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="user-info-input" />
                </div>
                {(currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN') && (viewedUser.role !== 'CANDIDATE' && viewedUser.role !== 'ADMIN' && viewedUser.role !== 'SUPER_ADMIN') &&
                <div className="user-info-item">
                    <span className="user-info-label">Department:</span> 
                    <Autocomplete
                    value={selectedDepartment}
                    size="small"
                    className={classes.root}
                    onChange={(event, selectedDepartment) => {
                    setSelectedDepartment(selectedDepartment);
                    }}
                    id="department-selection-box"
                    options={departments}
                    getOptionLabel={(option) => option.departmentName}
                    style={{ width: '100%' }}
                    renderInput={(params) => <TextField {...params} style={{marginLeft: '18px', width:'75%', marginBottom:'5px'}} label="Select department..." variant="outlined" />}
                    />
                </div>
                }
                <div className="user-info-item">
                    <span className="user-info-label">Address:</span> 
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="user-info-input" />
                </div>
                <div className="user-info-item">
                    <span className="user-info-label">Phone:</span> 
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="user-info-input" />
                </div>
                <div className="user-info-item">
                    <span className="user-info-label">Graduated from:</span> 
                    <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} className="user-info-input" />
                </div>
                <div className="user-info-item">
                    <span className="user-info-label">About:</span> 
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="user-info-input user-info-bio" />
                </div>
            </div>
        </div>
        </div>


    )
    else if (isChangingPassword) return(
        <div id="user-info-darken-background">
        <div id="user-info-pane-root">
            <div id="user-info-pane-header">Change Password</div>
            <div onClick={()=> dispatch(setIsViewingUser(false))} id="user-info-pane-exit">X</div>
            <div id="user-info-pane-container">
                <button className="user-info-edit-btn" onClick={()=>setIsChangingPassword(false)}>Cancel</button>
                <button className="user-info-save-btn" onClick={handleUpdatePassword}>Update Password</button>
                {currentUser.id === viewedUser.id && viewedUser.alert && viewedUser.role === 'CANDIDATE' && 
                <button className="user-info-edit-btn" onClick={()=>dispatch(setCandidateAlerts(currentUser.id, false))}>Turn off Alerts</button>
                }
                {currentUser.id === viewedUser.id && !viewedUser.alert && viewedUser.role === 'CANDIDATE' && 
                <button className="user-info-edit-btn" onClick={()=>dispatch(setCandidateAlerts(currentUser.id, true))}>Turn on Alerts</button>
                }
                <div className="change-password-form">
                    <div className="user-info-item">
                        <span className="user-info-label pass-form-item">Old Password:</span> 
                        <input type="text" value={oldPass} onChange={(e) => setOldPass(e.target.value)} className="user-info-input" />
                    </div>
                    <div className="user-info-item">
                        <span className="user-info-label pass-form-item">New Password:</span> 
                        <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="user-info-input" />
                    </div>
                    <div className="user-info-item">
                        <span className="user-info-label pass-form-item">Confirm Password:</span> 
                        <input type="password" value={newPassRep} onChange={(e) => setNewPassRep(e.target.value)} className="user-info-input" />
                    </div>
                    
                    <div style={{color: errorMessage === 'Password change successful' ? 'white' : 'red'}} className="password-change-error-msg">
                        {errorMessage}
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default UserInfoPane;