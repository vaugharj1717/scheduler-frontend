import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import './View-Meetings-Page.css';
import {setIsViewingFeedback, beginSettingAlert, beginGettingUpcomingMeetingsForUser, 
    beginGettingPastMeetingsForUser, setIsViewingUser, beginSubmittingFeedback} from '../../actions.js';
import Nav from '../nav/Nav.js';
import moment from 'moment';
import MomentUtils from "@date-io/moment";

function getParticipationId(meeting, user){
    for(let i = 0; i < meeting.participations.length; i++){
        if(meeting.participations[i].participant.id === user.id){
            return meeting.participations[i].id;
        }
    }
    return -1;
}
function canLeaveFeedback(meeting, user){
    for(let i = 0; i < meeting.participations.length; i++){
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

function alertIsActivated(meeting, user){
    for(let i = 0; i < meeting.participations.length; i++){
        if(meeting.participations[i].participant.id === user.id && meeting.participations[i].alert === true){
            return true;
        }
    }
    return false;
}

function isParticipant(meeting, user){
    for(let i = 0; i < meeting.participations.length; i++){
        if(meeting.participations[i].participant.id === user.id){
            return true;
        }
    }
    return false;
}

function groupMeetingsByDate(meetings){
    return meetings.reduce((acc, curr) => {
        let dateString = new moment(curr.startTime).utcOffset('+0000').format('dddd MMM D, YYYY');
        if(!(dateString in acc))
            acc[dateString] = []
        acc[dateString].push(curr);
        return acc;
    }, {});
}

function ViewMeetingsPage(props){
    let dispatch = useDispatch();
    let mode = props.mode;
    let currentUser = useSelector(state => state.currentUser);
    let viewedUser = props.user;
    let viewingOther = props.viewingOther;
    let pastMeetings = useSelector(state => state.pastMeetings);
    let upcomingMeetings = useSelector(state => state.upcomingMeetings);
    let [whichMeetings, setWhichMeetings] = useState("upcoming");

    let [isLeavingFeedback, setIsLeavingFeedback] = useState(false);
    let [focusedMeetingIndex, setFocusedMeetingIndex] = useState(-1);
    let [focusedMeetingOuterIndex, setFocusedMeetingOuterIndex] = useState(-1);
    let [feedback, setFeedback] = useState("");

    const pastMeetingsByDate = groupMeetingsByDate(pastMeetings);
    const upcomingMeetingsByDate = groupMeetingsByDate(upcomingMeetings);


    useEffect(()=>{
        dispatch(beginGettingUpcomingMeetingsForUser(viewedUser.id));
        dispatch(beginGettingPastMeetingsForUser(viewedUser.id));
    }, [viewedUser]);

    function handleCancel(){
        setFeedback("");
        setFocusedMeetingIndex(-1);        
    }

    function handleSubmit(participationId){
        dispatch(beginSubmittingFeedback(feedback, participationId));
        setFocusedMeetingIndex(-1);
        setFeedback("");
    }

    function handleSetWhichMeetings(which){
        setWhichMeetings(which);
        setFocusedMeetingIndex(-1);
        setFeedback("");
    }

    function handleAlert(val, participationId, meeting){
        if(participationId !== -1){
            dispatch(beginSettingAlert(val, participationId, whichMeetings, meeting));
        }
    }

    return (
        <div className="meetings-page-root">
            <Nav/>
            {whichMeetings === "upcoming" ?
            <div className="meetings-page-header">UPCOMING MEETINGS</div>
            :
            <div className="meetings-page-header">PAST MEETINGS</div>
            }
            {viewingOther &&
            <div className="meetings-page-disclaimer">
            &nbsp;*You are viewing {viewedUser.name}'s meetings* <div>&nbsp;&nbsp;Click <Link to="/test">here</Link> to go to home page.</div>
            </div>
            }
            <div className="meetings-selector">
                <div onClick={()=>handleSetWhichMeetings("past")} className="past-meetings-selector">See Past Meetings</div>
                <div onClick={()=>handleSetWhichMeetings("upcoming")} className="upcoming-meetings-selector">See Upcoming Meetings</div>
            </div>
            <div className="meetings-container">
                {whichMeetings === "upcoming" ? 
                <div>
                    {Object.keys(upcomingMeetingsByDate).map((upcomingMeetingDate, i) => (
                        <div key={i}>
                            <div className="meetings-date-header">{upcomingMeetingDate}</div>
                            {upcomingMeetingsByDate[upcomingMeetingDate].map((meeting, j) => (
                                <div key={i} className="view-meetings-meeting-box">
                                    
                                    {/* PARTICIPANT FEEDBACK CONTROLS */}
                                    <div className="meeting-box-feedback-btns-container">
                                    {(mode === 'PARTICIPANT' || mode === 'DEPARTMENT_ADMIN') && canLeaveFeedback(meeting, currentUser) && (focusedMeetingIndex !== j || focusedMeetingOuterIndex !== i) &&
                                        <div onClick={()=>{setFocusedMeetingIndex(j); setFocusedMeetingOuterIndex(i)}} className="leave-feedback-btn">Leave Feedback</div>
                                    }
                                    {(mode === 'PARTICIPANT' || mode === 'DEPARTMENT_ADMIN') && canLeaveFeedback(meeting, currentUser) && focusedMeetingIndex === j && focusedMeetingOuterIndex === i &&
                                        <div onClick={handleCancel} className="leave-feedback-btn">Cancel</div>
                                    }
                                    {((mode === 'PARTICIPANT' && canViewFeedback(meeting, currentUser)) || currentUser.role === 'DEPARTMENT_ADMIN') &&
                                        <div onClick={()=>dispatch(setIsViewingFeedback(true, meeting.id))} className="view-feedback-btn">View Feedback</div>
                                    }
                                    {(mode === 'PARTICIPANT' || mode === 'DEPARTMENT_ADMIN') && alertIsActivated(meeting, currentUser) &&
                                        <div onClick={()=>handleAlert(false, getParticipationId(meeting, currentUser), meeting)} className="deactivate-alert-btn">Turn Off Alert</div>
                                    }
                                    {(mode === 'PARTICIPANT' || mode === 'DEPARTMENT_ADMIN') && !alertIsActivated(meeting, currentUser) && isParticipant(meeting, currentUser) &&
                                        <div onClick={()=>handleAlert(true, getParticipationId(meeting, currentUser), meeting)} className="activate-alert-btn">Turn On Alert</div>
                                    }
                                    </div>
                                    {/*********************************/}

                                    {/* MEETING-BOX-CONTENTS */}
                                    {j === focusedMeetingIndex && i === focusedMeetingOuterIndex &&
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Feedback: </div>
                                        <textarea value={feedback} onChange={(e)=>{setFeedback(e.target.value)}} className="feedback-textarea" />
                                    </div>
                                    }
                                    {j === focusedMeetingIndex && i === focusedMeetingOuterIndex &&
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label"></div>
                                        <button onClick={()=>handleSubmit(getParticipationId(meeting, currentUser))} className="submit-btn">Submit</button>
                                    </div>
                                    }
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Candidate: </div>
                                        <div onClick={()=>dispatch(setIsViewingUser(true, meeting.schedule.candidacy.candidate.id))} className="meeting-item-value meeting-candidate">{meeting.schedule.candidacy.candidate.name}</div>
                                    </div>
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Position: </div>
                                        <div className="meeting-item-value">{meeting.schedule.candidacy.position.positionName}</div>   
                                    </div>
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Department: </div>
                                        <div className="meeting-item-value">{meeting.schedule.candidacy.position.department.departmentName}</div>   
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
                                        <div className="meeting-item-value">{new moment(meeting.startTime).utcOffset('+0000').format('h:mmA')} - {new moment(meeting.endTime).utcOffset('+0000').format('h:mmA')}</div>
                                    </div>
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Location: </div>
                                        <div className="meeting-item-value">{meeting.location.buildingName} {meeting.location.roomNumber.toString().padStart(3, '0')}</div>
                                    </div>
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Participants: </div>
                                        <div className="meeting-item-value">
                                            {meeting.participations.map((participation, j, arr) => (
                                            <span key={j} onClick={()=>dispatch(setIsViewingUser(true, participation.participant.id))}>
                                                <span className="meeting-participation">{participation.participant.name}</span>
                                                {j !== arr.length - 1 &&
                                                <span>, </span>
                                                }
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                    {/*********************************/}
                                </div>
                            ))}
                        </div>
                    ))}
                    {Object.keys(upcomingMeetingsByDate).length === 0 &&
                        <div className="meetings-page-nothing">
                            No meetings to show.
                        </div>
                    }
                </div>
                :
                <div>
                    {Object.keys(pastMeetingsByDate).map((pastMeetingDate, i) => (
                        <div key={i}>
                            <div className="meetings-date-header">{pastMeetingDate}</div>
                            {pastMeetingsByDate[pastMeetingDate].map((meeting, j) => (
                                <div key={i} className="view-meetings-meeting-box">
                                    
                                    {/* PARTICIPANT FEEDBACK CONTROLS */}
                                    <div className="meeting-box-feedback-btns-container">
                                    {(mode === 'PARTICIPANT' || mode === 'DEPARTMENT_ADMIN') && canLeaveFeedback(meeting, currentUser) && (focusedMeetingIndex !== j || focusedMeetingOuterIndex !== i) &&
                                        <div onClick={()=>{setFocusedMeetingIndex(j); setFocusedMeetingOuterIndex(i)}} className="leave-feedback-btn">Leave Feedback</div>
                                    }
                                    {(mode === 'PARTICIPANT' || mode === 'DEPARTMENT_ADMIN') && canLeaveFeedback(meeting, currentUser) && focusedMeetingIndex === j && focusedMeetingOuterIndex === i &&
                                        <div onClick={handleCancel} className="leave-feedback-btn">Cancel</div>
                                    }
                                    {((mode === 'PARTICIPANT' || mode === 'DEPARTMENT_ADMIN') && canViewFeedback(meeting, currentUser) || currentUser.role === 'DEPARTMENT_ADMIN') &&
                                        <div onClick={()=>dispatch(setIsViewingFeedback(true, meeting.id))} className="view-feedback-btn">View Feedback</div>
                                    }
                                    {(mode === 'PARTICIPANT' || mode === 'DEPARTMENT_ADMIN') && alertIsActivated(meeting, currentUser) &&
                                        <div onClick={()=>handleAlert(false, getParticipationId(meeting, currentUser), meeting)} className="deactivate-alert-btn">Turn Off Alert</div>
                                    }
                                    {(mode === 'PARTICIPANT' || mode === 'DEPARTMENT_ADMIN') && !alertIsActivated(meeting, currentUser) && isParticipant(meeting, currentUser) &&
                                        <div onClick={()=>handleAlert(true, getParticipationId(meeting, currentUser), meeting)} className="activate-alert-btn">Turn On Alert</div>
                                    }
                                    </div>
                                    {/*********************************/}

                                    {/* MEETING-BOX-CONTENTS */}
                                    {j === focusedMeetingIndex && i === focusedMeetingOuterIndex &&
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Feedback: </div>
                                        <textarea value={feedback} onChange={(e)=>{setFeedback(e.target.value)}} className="feedback-textarea" />
                                    </div>
                                    }
                                    {j === focusedMeetingIndex && i === focusedMeetingOuterIndex &&
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label"></div>
                                        <button onClick={()=>handleSubmit(getParticipationId(meeting, currentUser))} className="submit-btn">Submit</button>
                                    </div>
                                    }
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Candidate: </div>
                                        <div onClick={()=>dispatch(setIsViewingUser(true, meeting.schedule.candidacy.candidate.id))} className="meeting-item-value meeting-candidate">{meeting.schedule.candidacy.candidate.name}</div>
                                    </div>
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Position: </div>
                                        <div className="meeting-item-value">{meeting.schedule.candidacy.position.positionName}</div>   
                                    </div>
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Department: </div>
                                        <div className="meeting-item-value">{meeting.schedule.candidacy.position.department.departmentName}</div>   
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
                                        <div className="meeting-item-value">{new moment(meeting.startTime).utcOffset('+0000').format('h:mmA')} - {new moment(meeting.endTime).utcOffset('+0000').format('h:mmA')}</div>
                                    </div>
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Location: </div>
                                        <div className="meeting-item-value">{meeting.location.buildingName} {meeting.location.roomNumber.toString().padStart(3, '0')}</div>
                                    </div>
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Participants: </div>
                                        <div className="meeting-item-value">
                                        {meeting.participations.map((participation, j, arr) => (
                                            <span key={j} onClick={()=>dispatch(setIsViewingUser(true, participation.participant.id))}>
                                                <span className="meeting-participation">{participation.participant.name}</span>
                                                {j !== arr.length - 1 &&
                                                <span>, </span>
                                                }
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                    {/*********************************/}
                                </div>
                            ))}
                        </div>
                    ))}
                    {Object.keys(pastMeetingsByDate).length === 0 &&
                        <div className="meetings-page-nothing">
                            No meetings to show.
                        </div>
                    }
                </div>
                }
            </div>
        </div>
    )
}
export default ViewMeetingsPage;