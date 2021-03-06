import React, {useEffect, useState} from 'react';
import './Received-Message.css';
import {Switch, Route, Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {makeStyles, createMuiTheme} from "@material-ui/core/styles";
import {setIsViewingUser, setUserToMessage} from '../../../actions.js';
import moment from 'moment';




export default function ReceivedMessage(props) {
    let dispatch = useDispatch();
    let message = props.message;

    function wasSentToday(message){
        return new moment().utcOffset('+0000').format('MM/DD') === new moment(message.sentTime).utcOffset('+0000').format('MM/DD');
    }

    return(
        <div onClick={()=>dispatch(setUserToMessage(message.sender))} className="received-message-root">
            <div className="click-to-message">Click to set as recipient</div>
            {wasSentToday(message) ?
            <div className="received-message-header">
                Sent by <b className="message-receive-name" onClick={() => dispatch(setIsViewingUser(true, message.sender.id))}>{message.sender.name}</b> at <b>{new moment(message.sentTime).utcOffset('+0000').format('hh:mmA')}</b>
            </div>
            :
            <div className="received-message-header">
                Sent by <b className="message-receive-name" onClick={() => dispatch(setIsViewingUser(true, message.sender.id))}>{message.sender.name}</b> on <b>{new moment(message.sentTime).utcOffset('+0000').format('MM/DD hh:mmA')}</b>
            </div>
            }
            <div className="received-message-body">
                {message.message}
            </div>
        </div>
    )
}