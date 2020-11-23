import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {beginLoggingOut, beginRegistering, beginLoggingIn} from '../../actions.js';
import './Spinner.css';


export default function LoginPage(props){

    return(
        <div id="spinner-darken-background">
            <div className="loader"></div>
        </div>
    )
}