import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Switch, Route, Link} from 'react-router-dom';
import './View-All-Meetings-Page.css';
import {beginGettingUpcomingMeetings, beginGettingPastMeetings, setErrorMessage, setCreatingMeeting, beginDeletingMeeting, beginCreatingMeeting, beginEditingMeeting, beginGettingSchedule, 
    selectCandidacy, setIsViewingUser} from '../../actions.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Nav from '../nav/Nav.js';
import moment from 'moment';
import {makeStyles, createMuiTheme} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {ThemeProvider, withStyles } from "@material-ui/core/styles";
import MomentUtils from "@date-io/moment";
import {DatePicker as DatePicker2} from "react-datepicker";
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker
} from "material-ui-pickers";

/*
function groupMeetingsByDate(meetings){
    groupedMeetings = meetings.reduce((acc, curr) => {
        acc.map(group => {
            if(group.date === new moment(curr.startTime).format("YYYY/MM/DD")){
                return {...group, meetings: [...group.meetings, curr]};
            }
        })
    }, [])
}*/


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
function groupMeetingsByDate(meetings){
    return meetings.reduce((acc, curr) => {
        let dateString = new moment.utc(curr.startTime).local().format('dddd MMM D, YYYY');
        if(!(dateString in acc))
            acc[dateString] = []
        acc[dateString].push(curr);
        acc[dateString].sort();
        return acc;
    }, {});
}

function getMeetingStatus(meeting){
    let nowTime = new moment();
    let startTime = new moment.utc(meeting.startTime).local();
    let endTime = new moment.utc(meeting.endTime).local();
    if(nowTime > startTime && nowTime < endTime){
        const diff = endTime.diff(nowTime);
        const diffDuration = moment.duration(diff);
        const diffHours = Math.floor(diffDuration / 60);
        const diffMinutes = diffDuration % 60;
        const hours = diffDuration.hours() === 0 ? '' : diffDuration.hours() + ' hours';
        const minutes = diffDuration.minutes() === 0 ? '' : diffDuration.minutes() + ' minutes';
        return "In progress. " + hours + ' ' + minutes + ' remaining.';
    }
    else if(nowTime > endTime){
        return "Meeting has ended."
    }
    else{
        // get the difference between the moments
        const diff = startTime.diff(nowTime);
        const diffDuration = moment.duration(diff);
        const diffHours = Math.floor(diffDuration / 60);
        const diffMinutes = diffDuration % 60;
        const days = diffDuration.days() === 0 ? '' : diffDuration.days() + ' days';
        const hours = diffDuration.hours() === 0 ? '' : diffDuration.hours() + ' hours';
        const minutes = diffDuration.minutes() === 0 ? '' : diffDuration.minutes() + ' minutes';
        if(diffDuration.days() > 1) return "Meeting starts in " + days;
        else if (diffDuration.days() === 1) return "Meeting starts in " + days + ' ' + hours;
        else return "Meeting starts in " + days + ' ' + hours + ' ' + minutes;
    }
}

function getCandidacyFromMeeting(meeting){
    let candidacy = {candidate: meeting.schedule.candidacy.candidate, schedule: meeting.schedule};
    return candidacy;
}

function ViewAllMeetingsPage(props) {
    const classes = useStyles();

    let currentUser = useSelector(state => state.currentUser);
    let upMeetings = useSelector(state => state.allUpcomingMeetings);
    let paMeetings = useSelector(state => state.allPastMeetings);
    let upcomingMeetings = currentUser.role !== 'DEPARTMENT_ADMIN' ? upMeetings : upMeetings.filter(meeting => meeting.schedule.candidacy.position.department.id === currentUser.department.id);
    let pastMeetings = currentUser.role !== 'DEPARTMENT_ADMIN' ? paMeetings : paMeetings.filter(meeting => meeting.schedule.candidacy.position.department.id === currentUser.department.id)

    let [whichMeetings, setWhichMeetings] = useState('upcoming');
    let upcomingMeetingsByDate = groupMeetingsByDate(upcomingMeetings);
    let pastMeetingsByDate = groupMeetingsByDate(pastMeetings);

    function handleCandidacySelect(candidacy, position){
        dispatch(selectCandidacy(candidacy, position));
    }
    
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(beginGettingUpcomingMeetings());
        dispatch(beginGettingPastMeetings());
    }, []);


    return (
        <div className="meetings-page-root">
            <Link className="all-meetings-back" to='/test/meeting-scheduler'><span className="positions-back-arrow" style={{fontSize:'24px'}}>&#171;</span> To Positions Page</Link>
            <Nav/>
            {whichMeetings === "upcoming" ?
            <div className="meetings-page-header">ALL UPCOMING MEETINGS</div>
            :
            <div className="meetings-page-header">ALL PAST MEETINGS</div>
            }

            <div className="meetings-selector">
                <div onClick={()=>setWhichMeetings("past")} className="past-meetings-selector">See Past Meetings</div>
                <div onClick={()=>setWhichMeetings("upcoming")} className="upcoming-meetings-selector">See Upcoming Meetings</div>
            </div>
            <div className="meetings-container">
                {whichMeetings === "upcoming" ? 
                <div>
                    {Object.keys(upcomingMeetingsByDate).map((upcomingMeetingDate, i) => (
                        <div key={i}>
                            <div className="meetings-date-header">{upcomingMeetingDate}</div>
                            {upcomingMeetingsByDate[upcomingMeetingDate].map((meeting, j) => (
                                <div key={i} className="view-meetings-meeting-box">
                                    <div className="view-meetings-schedule">
                                        <Link to="meeting-scheduler/view-schedule" onClick={()=>{dispatch(selectCandidacy(getCandidacyFromMeeting(meeting), meeting.schedule.candidacy.position))}} className="see-schedule-link">View Schedule For This Meeting</Link>
                                    </div>
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
                                        <div className="meeting-item-value">{meeting.schedule.candidacy.position.department !== null ? meeting.schedule.candidacy.position.department.departmentName : "[DELETED]"}</div>   
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
                                        <div className="meeting-item-value">{new moment.utc(meeting.startTime).local().format('h:mmA')} - {new moment.utc(meeting.endTime).local().format('h:mmA')}</div>
                                    </div>
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Location: </div>
                                        <div className="meeting-item-value">{meeting.location !== null ? meeting.location.buildingName : "[DELETED]"} {meeting.location !== null ? meeting.location.roomNumber.toString().padStart(3, '0') : ""}</div>
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
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Status: </div>
                                        <div className="meeting-item-value">{getMeetingStatus(meeting)}</div>
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
                                    <div className="view-meetings-schedule">
                                        <Link to="meeting-scheduler/view-schedule" onClick={()=>{dispatch(selectCandidacy(getCandidacyFromMeeting(meeting), meeting.schedule.candidacy.position))}} className="see-schedule-link">View Schedule</Link>
                                    </div>
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
                                        <div className="meeting-item-value">{new moment.utc(meeting.startTime).local().format('h:mmA')} - {new moment.utc(meeting.endTime).local().format('h:mmA')}</div>
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
                                    <div className="meeting-box-item">
                                        <div className="meeting-item-label">Status: </div>
                                        <div className="meeting-item-value">{getMeetingStatus(meeting)}</div>
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

export default ViewAllMeetingsPage;