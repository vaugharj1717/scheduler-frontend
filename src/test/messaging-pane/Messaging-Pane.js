import React, {useEffect, useState} from 'react';
import './Messaging-Pane.css';
import ReceivedMessage from './components/Received-Message.js';
import SentMessage from './components/Sent-Message.js';
import MessageToSend from './components/Message-To-Send.js';
import {Switch, Route, Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {setIsViewingMessages, beginGettingRecipients} from '../../actions.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {makeStyles, createMuiTheme} from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
        color: "white",
      },
      "& .MuiOutlinedInput-input": {
        color: "white"
      },
      "& .MuiInputLabel-outlined": {
        color: "white"
      },
      "& .MuiAutocomplete-popupIndicator": {
        color: "white",
      },
      "& .MuiAutocomplete-clearIndicator": {
          color: "white"
      },
      color: "white !important",
      borderWidth: '1px',
      borderColor: "white !important",
    }
})


function MessagingPane(props) {
    const classes = useStyles;
    const dispatch = useDispatch();
    let messages = useSelector(state => state.messages);
    let currentUser = useSelector(state => state.currentUser);
    let possibleRecipients = useSelector(state => state.possibleRecipients);
    let [selectedRecipient, setSelectedRecipient] = useState(null);

    useEffect(()=>{
        dispatch(beginGettingRecipients());
    }, [])

    return(
        <div id="messaging-pane-darken-background">
        <div id="messaging-pane-root">
            <div id="messaging-pane-header">Messages</div>
            <div onClick={()=> dispatch(setIsViewingMessages(false))} id="messaging-pane-exit">X</div>
            <div id="messaging-pane-message-container">
                <MessageToSend />
                {messages.map((message, i) => {
                    if(message.sender.id === currentUser.id){
                        return <SentMessage key={i} message={message} />
                    }
                    else if(message.receiver.id === currentUser.id){
                        return <ReceivedMessage key={i} message={message} />
                    }
                })}
                
            </div>
        </div>
        </div>
    )
}

export default MessagingPane