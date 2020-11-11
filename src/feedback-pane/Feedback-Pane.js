import React, {useEffect, useState} from 'react';
import './Feedback-Pane.css';
import {useSelector, useDispatch} from 'react-redux';
import {beginGettingFeedback, setIsViewingFeedback} from '../actions.js';




function FeedbackPane(props) {
    const dispatch = useDispatch();
    let feedback = useSelector(state => state.feedback);
    let meetingId = props.meetingId;

    useEffect(()=>{
        dispatch(beginGettingFeedback(meetingId))
    }, []);

    return(
        <div id="feedback-pane-darken-background">
        <div id="feedback-pane-root">
            <div id="feedback-pane-header">Feedback</div>
            <div onClick={()=> dispatch(setIsViewingFeedback(false))} id="feedback-pane-exit">X</div>
            <div id="feedback-pane-container">
                {feedback.map((feedback, i) => {
                    if (feedback.feedback !== null && feedback.feedback !== ''){
                    return (
                        <div key={i} className="feedback-item">
                            <div className="feedback-label"><b>{feedback.participant.name}</b> says:</div>
                        
                            <div className="feedback-text">{feedback.feedback}</div>
                        </div>
                    )} else return (
                        <div></div>
                    )
                }
                )}
            </div>
        </div>
        </div>
    )
}

export default FeedbackPane;