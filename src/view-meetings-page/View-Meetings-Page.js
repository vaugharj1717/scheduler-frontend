import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import './View-Meetings-Page.css';
import {beginGettingUpcomingMeetingsForUser, beginGettingPastMeetingsForUser, setIsViewingUser} from '../actions.js';

import moment from 'moment';
import MomentUtils from "@date-io/moment";


function canLeaveFeedback(meeting, user){
    for(let i = 0; i < meeting.participations.length; i++){
        console.log('in loop')
        if(meeting.participations[i].participant.id === user.id && meeting.participations[i].canLeaveFeedback){
            return true;
        }
    }
    return false;
}
function canViewFeedback(meeting, user){
    for(let i = 0; i < meeting.participations.length; i++){
        if(meeting.participations[i].participant.id === user.id && meeting.participations[i].canViewFeedback){
            return true;
        }
    }
    return false;
}

function ViewSchedulePage(props){
    let dispatch = useDispatch();
    let mode = props.mode;
    let currentUser = useSelector(state => state.currentUser);
    let pastMeetings = useSelector(state => state.pastMeetings);
    let upcomingMeetings = useSelector(state => state.upcomingMeetings);
    let [whichMeetings, setWhichMeetings] = useState("upcoming");

    useEffect(()=>{
        dispatch(beginGettingUpcomingMeetingsForUser(currentUser.id));
        dispatch(beginGettingPastMeetingsForUser(currentUser.id));
    }, []);


    return (
        <div className="meetings-page-root">
            {whichMeetings === "upcoming" ?
            <div className="meetings-page-header">UPCOMING MEETINGS</div>
            :
            <div className="meetings-page-header">PAST MEETINGS</div>
            }
            <div className="meetings-selector">
                <div onClick={()=>setWhichMeetings("past")} className="past-meetings-selector">See Past Meetings</div>
                <div onClick={()=>setWhichMeetings("upcoming")} className="upcoming-meetings-selector">See Upcoming Meetings</div>
            </div>
            <div className="meetings-container">
                {whichMeetings === "upcoming" ? 
                upcomingMeetings.map((meeting, i) => (
                    <div key={i} className="meeting-box">
                        
                        {/* PARTICIPANT FEEDBACK CONTROLS */}
                        <div className="meeting-box-feedback-btns-container">
                        {mode === 'PARTICIPANT' && canLeaveFeedback(meeting, currentUser) &&
                            <div className="leave-feedback-btn">Leave Feedback</div>
                        }
                        {mode === 'PARTICIPANT' && canViewFeedback(meeting, currentUser) &&
                            <div className="view-feedback-btn">View Feedback</div>
                        }
                        </div>
                        {/*********************************/}

                        {/* MEETING-BOX-CONTENTS */}
                        <div className="meeting-box-item">
                            <div className="meeting-item-label">Candidate: </div>
                            <div onClick={()=>dispatch(setIsViewingUser(true, meeting.schedule.candidacy.candidate.id))} className="meeting-item-value meeting-candidate">{meeting.schedule.candidacy.candidate.name}</div>
                        </div>
                        <div className="meeting-box-item">
                            <div className="meeting-item-label">Activity: </div>
                            {meeting.meetingType === 'MEET_FACULTY' ? 
                            <div className="meeting-item-value">Meeting with faculty</div>
                            :
                            <div className="meeting-item-value">Presentation to students</div>
                            }
                        </div>
                        <div className="meeting-box-item">
                            <div className="meeting-item-label">Time: </div>
                            <div className="meeting-item-value">{new moment(meeting.startTime).utcOffset('+0000').format('MMM DD, YYYY')} from {new moment(meeting.startTime).utcOffset('+0000').format('hh:mmA')} to {new moment(meeting.endTime).utcOffset('+0000').format('hh:mmA')}</div>
                        </div>
                        <div className="meeting-box-item">
                            <div className="meeting-item-label">Location: </div>
                            <div className="meeting-item-value">{meeting.location.buildingName} {meeting.location.roomNumber}</div>
                        </div>
                        <div className="meeting-box-item">
                            <div className="meeting-item-label">Participants: </div>
                            <div className="meeting-item-value">
                                {meeting.participations.map((participation, j) => (
                                    <div key={j} onClick={()=>dispatch(setIsViewingUser(true, participation.participant.id))} className="meeting-participation">
                                        {participation.participant.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/*********************************/}
                    </div>
                ))
                :
                pastMeetings.map((meeting, i) => (
                    <div key={i} className="meeting-box">
                        
                        {/* PARTICIPANT FEEDBACK CONTROLS */}
                        <div className="meeting-box-feedback-btns-container">
                        {mode === 'PARTICIPANT' && canLeaveFeedback(meeting, currentUser) &&
                            <div className="leave-feedback-btn">Leave Feedback</div>
                        }
                        {mode === 'PARTICIPANT' && canViewFeedback(meeting, currentUser) &&
                            <div className="view-feedback-btn">View Feedback</div>
                        }
                        </div>
                        {/*********************************/}

                        {/* MEETING-BOX-CONTENTS */}
                        <div className="meeting-box-item">
                            <div className="meeting-item-label">Candidate: </div>
                            <div onClick={()=>dispatch(setIsViewingUser(true, meeting.schedule.candidacy.candidate.id))} className="meeting-item-value meeting-candidate">{meeting.schedule.candidacy.candidate.name}</div>
                        </div>
                        <div className="meeting-box-item">
                            <div className="meeting-item-label">Activity: </div>
                            {meeting.meetingType === 'MEET_FACULTY' ? 
                            <div className="meeting-item-value">Meeting with faculty</div>
                            :
                            <div className="meeting-item-value">Presentation to students</div>
                            }
                        </div>
                        <div className="meeting-box-item">
                            <div className="meeting-item-label">Time: </div>
                            <div className="meeting-item-value">{new moment(meeting.startTime).utcOffset('+0000').format('MMM DD, YYYY')} from {new moment(meeting.startTime).utcOffset('+0000').format('hh:mmA')} to {new moment(meeting.endTime).utcOffset('+0000').format('hh:mmA')}</div>
                        </div>
                        <div className="meeting-box-item">
                            <div className="meeting-item-label">Location: </div>
                            <div className="meeting-item-value">{meeting.location.buildingName} {meeting.location.roomNumber}</div>
                        </div>
                        <div className="meeting-box-item">
                            <div className="meeting-item-label">Participants: </div>
                            <div className="meeting-item-value">
                                {meeting.participations.map((participation, j) => (
                                    <div key={j} onClick={()=>dispatch(setIsViewingUser(true, participation.participant.id))} className="meeting-participation">
                                        {participation.participant.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/*********************************/}
                    </div>
                ))
                }
            </div>
        </div>
    )
}
export default ViewSchedulePage;