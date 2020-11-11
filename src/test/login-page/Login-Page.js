import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {beginLoggingOut, beginRegistering, beginLoggingIn} from '../../actions.js';
import './Login-Page.css';


export default function LoginPage(props){
    const dispatch = useDispatch();
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");


    function login(){
    dispatch(beginLoggingIn(email, password));
    }
    function register(){
    dispatch(beginRegistering(email, password));
    }

    return(
            <div id="login-container">
                <div id="login-header">LOGIN</div>
                <div>
                <label className="login-label">Email: <input type="textbox" value={email} onChange={(e)=>setEmail(e.target.value)}></input></label>
                <label className="login-label">Password: <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input></label>
                <button id="login-btn" onClick={login}>Login</button> 
                </div>
                
            </div>
    )
}