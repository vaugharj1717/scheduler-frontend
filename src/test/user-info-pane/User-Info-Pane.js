import React, {useEffect, useState} from 'react';
import './User-Info-Pane.css';
import {useSelector, useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import {setCandidateAlerts, setIsViewingUser, beginGettingUser, selectUser,
    setIsViewingFiles, beginUpdatingUserInfo, beginUpdatingPassword} from '../../actions.js';




function UserInfoPane(props) {
    const dispatch = useDispatch();
    let currentUser = useSelector(state => state.currentUser);
    let viewedUser = useSelector(state => state.viewedUser);
    let errorMessage = useSelector(state => state.errorMessage);
    let userId = props.userId
    let [isEditing, setIsEditing] = useState(false);
    let [isChangingPassword, setIsChangingPassword] = useState(false);
    let [address, setAddress] = useState(viewedUser.address);
    let [phone, setPhone] = useState(viewedUser.phone);
    let [university, setUniversity] = useState(viewedUser.university);
    let [bio, setBio] = useState(viewedUser.bio);
    let [oldPass, setOldPass] = useState('');
    let [newPass, setNewPass] = useState('');
    let [newPassRep, setNewPassRep] = useState('');

    useEffect(()=>{
        dispatch(beginGettingUser(userId));
    }, []);

    function handleViewAllMeetings(user){
        dispatch(setIsViewingUser(false));
        dispatch(selectUser(user));
    }
    function handleViewFiles(){
        dispatch(setIsViewingFiles(true, viewedUser.id));
    }

    function handleEdit(){
        setAddress(viewedUser.address);
        setPhone(viewedUser.phone);
        setUniversity(viewedUser.university);
        setBio(viewedUser.bio);
        setIsEditing(true);
    }

    function handleSave(){
        dispatch(beginUpdatingUserInfo(userId, address, phone, university, bio));
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
                {currentUser.id === viewedUser.id &&
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
                
                <div className="user-info-item">
                    <span className="user-info-label">Name:</span> 
                    <span className="user-info-data">{viewedUser.name}</span>
                </div>
                <div className="user-info-item">
                    <span className="user-info-label">Email:</span> 
                    <span className="user-info-data">{viewedUser.email}</span>
                </div>
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
                <div className="user-info-item">
                    <span className="user-info-label">View all meetings:</span> 
                    <Link to="/test/user/view-all-meetings" className="user-info-data link-to-files" onClick={()=>handleViewAllMeetings(viewedUser)}>Click to view</Link>
                </div>
                <div className="user-info-item">
                    <span className="user-info-label">About:</span> 
                    <span className="user-info-data">{viewedUser.bio}</span>
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
                    <span className="user-info-data">{viewedUser.name}</span>
                </div>
                <div className="user-info-item">
                    <span className="user-info-label">Email:</span> 
                    <span className="user-info-data">{viewedUser.email}</span>
                </div>
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
                    <span className="user-info-label">Uploaded Files:</span> 
                    <span onClick={handleViewFiles} className="user-info-data link-to-files">Click to view</span>
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
                    <div className="password-change-error-msg">
                        {errorMessage}
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default UserInfoPane;