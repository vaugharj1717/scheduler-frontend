import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {beginLoggingOut, beginRegistering, beginLoggingIn} from '../actions.js';
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
        <div>
            <input type="textbox" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
            <input type="textbox" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
            <button onClick={register}>Register</button>
            <button onClick={login}>Login</button> 
            </div>
    )
}