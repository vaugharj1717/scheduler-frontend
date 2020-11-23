import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {beginLoggingOut, setIsViewingMessages, setIsViewingUser} from '../../actions.js';
import './Nav.css';


export default function LoginPage(props){
    let dispatch = useDispatch();
    let currentUser = useSelector(state => state.currentUser);
    let showNotifier = useSelector(state => state.showUnseenMessagesNotifier);
    // let showNotifier = true;
    let [isDropped, setIsDropped] = useState(false);
    let style = props.style;

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
                <div className="nav-btn" onClick={()=>handleAccount()  }><span className="nav-txt">Account</span></div>
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