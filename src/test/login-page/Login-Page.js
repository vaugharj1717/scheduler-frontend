import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {beginLoggingOut, beginRegistering, beginLoggingIn} from '../../actions.js';
import './Login-Page.css';


export default function LoginPage(props){
    const dispatch = useDispatch();
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let errorMessage = useSelector(state => state.errorMessage);

    function login(){
    dispatch(beginLoggingIn(email, password));
    }
    function register(){
    dispatch(beginRegistering(email, password));
    }

    return(
            <div id="login-container">
                <div id="login-header">UWEC Scheduler</div>
                <div id="login-form-container">
                    <div id="login-form-header">LOGIN</div>
                    <div id="login-tooltip-btn">
                        i
                        <div id="login-tooltip-txt">
                            This system does not allow self-registering. Registration must be done by a system administrator.
                            For development/presentation purposes, here are some credentials that can be used.
                            <ul id="login-tooltip-credentials">
                                <li><pre>participant@gmail.com     PASS: participant</pre></li>
                                <li><pre>candidate@gmail.com       PASS: candidate</pre></li>
                                <li><pre>scheduler@gmail.com       PASS: scheduler</pre></li>
                                <li><pre>admin@gmail.com           PASS: admin</pre></li>
                                <li><pre>superadmin@gmail.com      PASS: superadmin</pre></li>
                                <li><pre>departmentadmin@gmail.com PASS: departmentadmin</pre></li>
                            </ul>
                        </div>
                    </div>
                    <div className="login-form-input-grp">
                        <label className="login-label">Email: </label>
                        <input className="login-input" type="textbox" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
                    </div>
                    <div className="login-form-input-grp">
                        <label className="login-label">Password: </label>
                        <input className="login-input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
                    </div>
                    <button id="login-btn" onClick={login}>Login</button> 
                    <div className="login-error-msg">
                        {errorMessage}
                    </div>
                </div>
                
            </div>
    )
}