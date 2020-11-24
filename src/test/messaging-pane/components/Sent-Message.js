import React, {useEffect, useState} from 'react';
import './Sent-Message.css';
import {Switch, Route, Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {setIsViewingUser} from '../../../actions.js';
import {makeStyles, createMuiTheme} from "@material-ui/core/styles";
import moment from 'moment';




export default function SentMessage(props) {
    const dispatch = useDispatch();
    let message = props.message;

    function wasSentToday(message){
        return new moment().utcOffset('+0000').format('MM/DD') === new moment(message.sentTime).utcOffset('+0000').format('MM/DD');
    }

    return(
        <div className="sent-message-root">
            <div className="sent-message-header">
                {wasSentToday(message) ?
                <div className="sent-message-header">
                    Sent to <b className="message-send-name"onClick={() => dispatch(setIsViewingUser(true, message.receiver.id))}>{message.receiver.name}</b> at <b>{new moment(message.sentTime).utcOffset('+0000').format('hh:mmA')}</b>
                </div>
                :
                <div className="sent-message-header">
                    Sent to <b className="message-send-name"onClick={() => dispatch(setIsViewingUser(true, message.receiver.id))}>{message.receiver.name}</b> on <b>{new moment(message.sentTime).utcOffset('+0000').format('MM/DD hh:mmA')}</b>
                </div>
            }
            </div>
            <div className="sent-message-body">
                {message.message}
            </div>
        </div>
    )
}