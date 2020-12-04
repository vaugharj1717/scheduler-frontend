import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import {setMap, beginLoggingOut, setIsViewingMessages, setIsViewingUser} from '../../actions.js';
import './Nav.css';


export default function LoginPage(props){
    let dispatch = useDispatch();
    let currentUser = useSelector(state => state.currentUser);
    let showNotifier = useSelector(state => state.showUnseenMessagesNotifier);
    // let showNotifier = true;
    let [isDropped, setIsDropped] = useState(false);
    let [toAdmin, setToAdmin] = useState(false);
    let [toSchedule, setToSchedule] = useState(false);
    let style = props.style;

    function handleDropdownClick(val){
        if(val === 'admin'){
            setToAdmin(true);
        }
        else if(val === 'schedule'){
            setToSchedule(true);
        }
    }
    function handleAccount(){
        dispatch(setIsViewingUser(true, currentUser.id));
        setIsDropped(false);
    }
    function handleLogout(){
        if(window.confirm("Logout?")){
            dispatch(beginLoggingOut());
        }
        setIsDropped(false);
    }
    function handleMessenger(){
        dispatch(setIsViewingMessages(true));
        setIsDropped(false);
    }

    if(toAdmin) return (
        <Redirect to="/test/department-admin/admin"></Redirect>
    )
    if(toSchedule) return (
        <Redirect to="/test/department-admin"></Redirect>
    )
    return(
        <div className="nav-root" style={{backgroundColor : style === 'scheduler' ? '#08101b' : 'black'}}>
            <div className="nav-left">
                <div className="nav-logo">

                </div>
                <div className="nav-label">
                    UWEC SCHEDULER
                </div>
            </div>
            <div className="nav-right">
                <div className="nav-hamburger" onClick={()=>{setIsDropped(isDropped => !isDropped)}}>&#9776;
                {showNotifier &&
                    <div className="burger-message-notifier">!</div>
                }
                </div>
                {currentUser.role === 'DEPARTMENT_ADMIN' && style !== 'scheduler' &&
                <Link to='/test/department-admin/admin' className="nav-btn"><span className="nav-txt">Admin</span></Link>
                }
                {currentUser.role === 'DEPARTMENT_ADMIN' && style === 'scheduler' &&
                <Link to='/test/department-admin' className="nav-btn"><span className="nav-txt">Schedule</span></Link>
                }
                <div className="nav-btn" onClick={()=>handleAccount()  }><span className="nav-txt">Account</span></div>
                <div className="nav-btn" onClick={()=>dispatch(setMap(true, true))}><span className="nav-txt">Map</span></div>

                <div className="nav-btn" onClick={()=>handleMessenger()}>
                    <span className="nav-txt">Messenger
                    {showNotifier &&
                        <div className="message-notifier">!</div>
                    }
                    </span>
                </div>
                <div className="nav-btn" onClick={()=>handleLogout()   }><span className="nav-txt">Logout</span></div>
            </div>
            {isDropped &&
            <div className="dropdown-menu">
                {currentUser.role === 'DEPARTMENT_ADMIN' && style !== 'scheduler' &&
                <div onClick={()=>handleDropdownClick('admin')} className="drop-btn"><span className="drop-txt">Admin</span></div>
                }
                {currentUser.role === 'DEPARTMENT_ADMIN' && style === 'scheduler' &&
                <div onClick={()=>handleDropdownClick('schedule')} className="drop-btn"><span className="drop-txt">Schedule</span></div>
                }
                <div className="drop-btn" onClick={()=>handleAccount()  }><span className="drop-txt">Account</span></div>
                <div className="drop-btn" onClick={()=>handleMessenger()  }><span className="drop-txt">Messenger</span>
                {showNotifier &&
                    <div className="drop-message-notifier">!</div>
                }
                </div>
                <div className="drop-btn" onClick={()=>handleLogout()  }><span className="drop-txt">Logout</span></div>
            </div>
            }
        </div>
    )
}