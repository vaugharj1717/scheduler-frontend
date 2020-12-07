import React, {useEffect, useState, useRef} from 'react';
import './Message-To-Send.css';
import {setIsViewingUser, beginSendingMessage, beginGettingRecipients} from '../../../actions.js';
import {Switch, Route, Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {makeStyles, createMuiTheme} from "@material-ui/core/styles";
import moment from 'moment';




export default function MessageToSend(props) {
    let userToMessage = props.userToMessage;
    console.log("printing user to message");
    console.log(userToMessage);
    let dispatch = useDispatch();
    let possibleRecipients = useSelector(state => state.possibleRecipients);
    let [selectedRecipient, setSelectedRecipient] = useState(null);
    let sendMessageBodyRef = useRef(); 
    let currentUser = useSelector(state => state.currentUser);

    useEffect(()=>{
        dispatch(beginGettingRecipients());
    }, [])

    useEffect(()=>{
        if(userToMessage !== undefined && userToMessage !== null)
        setSelectedRecipient(userToMessage);
        else
        setSelectedRecipient(null);
    }, [userToMessage]);

    function handleSendMessage(){
        if(selectedRecipient !== null && sendMessageBodyRef.current.innerText !== ''){
            dispatch(beginSendingMessage(currentUser.id, selectedRecipient.id, sendMessageBodyRef.current.innerText));
            sendMessageBodyRef.current.innerText = '';
        }
    }

    return(
        <div className="send-message-root">
            <div className="send-message-header">
                <span className="send-message-to-label">To:</span>
                <Autocomplete
                value={selectedRecipient}
                onChange={(event, selectedRecipient) => {
                  setSelectedRecipient(selectedRecipient);
                }}
                size="small"
                id="recipient-selection-box"
                options={possibleRecipients}
                getOptionLabel={(option) => option.name}
                style={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} style={{marginLeft:"15px", width:'80%'}} label="Select recipient..." variant="outlined" />}
                />
                {selectedRecipient !== null && selectedRecipient !== undefined &&
                <span onClick={()=>dispatch(setIsViewingUser(true, selectedRecipient.id))} className="see-recipient-user-info">User Info</span>
                }
            </div>
            <div className="send-message-body">
                <div ref={sendMessageBodyRef} className="send-message-content" contenteditable="true"></div>
            </div>
            <button className="send-message-btn" onClick={handleSendMessage}>Send</button>
        </div>
    )
}