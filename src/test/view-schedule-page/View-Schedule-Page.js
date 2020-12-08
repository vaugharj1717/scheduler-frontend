import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Switch, Route, Link} from 'react-router-dom';
import './View-Schedule-Page.css';
import {setErrorMessage, setCreatingMeeting, beginDeletingMeeting, beginCreatingMeeting, beginEditingMeeting, beginGettingSchedule, 
    beginGettingLocations, beginGettingParticipants, setIsViewingUser} from '../../actions.js';
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

function ViewSchedulePage(props) {
    const classes = useStyles();
    
    let candidate = props.candidacy.candidate;
    let position = props.position;
    console.log(candidate);
    console.log(position);
    let schedule = useSelector(state => state.currentSchedule);
    let locations = useSelector(state => state.locations);
    let errorMsg = useSelector(state => state.errorMessage);
    let meetings = schedule.loaded === true ? groupMeetingsByDate(schedule.meetings) : [];

    let [selectedLocation, setSelectedLocation] = useState(null);
    let [selectedStartDate, setSelectedStartDate] = useState(new moment(new moment().format("YYYY/MM/DD")));
    let [meetingType, setMeetingType] = useState('MEET_FACULTY')
    let [selectedEndDate, setSelectedEndDate] = useState(new moment(new moment().format("YYYY/MM/DD")));
    let [participations, setParticipations] = useState([]);

    let [selectedEditLocation, setSelectedEditLocation] = useState(null);
    let [selectedEditStartDate, setSelectedEditStartDate] = useState(new moment(new moment().format("YYYY/MM/DD")));
    let [editMeetingType, setEditMeetingType] = useState('MEET_FACULTY')
    let [selectedEditEndDate, setSelectedEditEndDate] = useState(new moment(new moment().format("YYYY/MM/DD")));
    let [editParticipations, setEditParticipations] = useState([]);

    let [selectedDate, setSelectedDate] = useState(new moment(new moment().format("YYYY/MM/DD")));
    let [selectedStartTime, setSelectedStartTime] = useState(new moment(new moment().format("YYYY/MM/DD")));
    let [selectedEndTime, setSelectedEndTime] = useState(new moment(new moment().format("YYYY/MM/DD")));

    let [selectedEditDate, setSelectedEditDate] = useState(new moment(new moment().format("YYYY/MM/DD")));
    let [selectedEditStartTime, setSelectedEditStartTime] = useState(new moment(new moment().format("YYYY/MM/DD")));
    let [selectedEditEndTime, setSelectedEditEndTime] = useState(new moment(new moment().format("YYYY/MM/DD")));

    // let [isCreatingMeeting, setCreatingMeeting] = useState(false);
    let isCreatingMeeting = useSelector(state => state.isCreatingMeeting);
    let isEditingMeeting = useSelector(state => state.isEditingMeeting);
    let [isEditingIndex1, setIsEditingIndex1] = useState(-1);
    let [isEditingIndex2, setIsEditingIndex2] = useState(-1);

    //handling participants
    let [selectedParticipant, setSelectedParticipant] = useState(null);
    let [selectedEditParticipant, setSelectedEditParticipant] = useState(null);
    let participants = useSelector(state => state.participants);

    //let meetingsGroupedByDate = groupMeetingsByDate(schedule.meetings);

    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(beginGettingSchedule(props.candidacy.schedule.id))
        dispatch(beginGettingLocations());
        dispatch(beginGettingParticipants());
    }, []);

    useEffect(()=>{
        setSelectedLocation(null);
        setSelectedDate(new moment(new moment().format("YYYY/MM/DD")));
        setSelectedStartTime(new moment(new moment().format("YYYY/MM/DD")));
        setSelectedEndTime(new moment(new moment().format("YYYY/MM/DD")));
        setParticipations([]);
    }, [schedule]);

    function handleCancelMeetingCreation(){
        dispatch(setCreatingMeeting(false, false));
        setSelectedLocation(null);
        setSelectedStartTime(new moment(new moment().format("YYYY/MM/DD")));
        setSelectedEndTime(new moment(new moment().format("YYYY/MM/DD")));
        setParticipations([]);
    }

    function handleCancelMeetingEdit(){
        dispatch(setCreatingMeeting(false, false));
        setSelectedEditLocation(null);
        setSelectedEditDate(new moment(new moment().format("YYYY/MM/DD")));
        setSelectedEditStartTime(new moment(new moment().format("YYYY/MM/DD")));
        setSelectedEditEndTime(new moment(new moment().format("YYYY/MM/DD")));
        setEditParticipations([]);
    }

    function handleEditMeeting(meeting, i, j){
        dispatch(setErrorMessage(''));
        dispatch(setCreatingMeeting(false, true));
        setIsEditingIndex1(i);
        setIsEditingIndex2(j);

        setSelectedEditLocation(meeting.location);
        setSelectedEditDate(moment.utc(meeting.startTime).local());
        setSelectedEditStartTime(moment.utc(meeting.startTime).local());
        setSelectedEditEndTime(moment.utc(meeting.endTime).local());
        setEditMeetingType(meeting.meetingType);
        // setEditParticipations(meeting.participations);

        setEditParticipations(meeting.participations.map(participation => {
            const participant = participation.participant;
            return {role: participant.role, participantId: participant.id, name: participant.name, 
                canLeaveFeedback: participation.canLeaveFeedback, 
                canViewFeedback: participation.canViewFeedback}}));
    }


    function handleStartDateChange(startDate, isDateChange){
        setSelectedStartDate(startDate);
        // if(startDate !== null){
        //     setSelectedEndDate(endDate => {
        //         endDate.date(startDate.date());
        //         endDate.month(startDate.month());
        //         endDate.year(startDate.year());
        //         return endDate;
        //     })
        // }
    }


    function handleEndDateChange(endDate, isDateChange){
        setSelectedEndDate(endDate);
        // if(endDate !== null){
        //     setSelectedStartDate(startDate => {
        //         startDate.date(endDate.date());
        //         startDate.month(endDate.month());
        //         startDate.year(endDate.year());
        //         return startDate;
        //     })
        // }
    }

    function handleDateChange(date){
        setSelectedDate(date);
    }

    function handleStartTimeChange(time){
        setSelectedStartTime(time);
    }

    function handleEndTimeChange(time){
        setSelectedEndTime(time);
    }

    function handleEditDateChange(date){
        setSelectedEditDate(date);
    }

    function handleEditStartTimeChange(time){
        setSelectedEditStartTime(time);
    }

    function handleEditEndTimeChange(time){
        setSelectedEditEndTime(time);
    }

    function handleEditStartDateChange(startDate, isDateChange){
        setSelectedEditStartDate(startDate);

        if(startDate !== null){
            setSelectedEditEndDate(endDate => {
            console.log(endDate);
            endDate.date(startDate.date());
            endDate.month(startDate.month());
            endDate.year(startDate.year());
            return endDate;
            });
        }
    }

    function handleEditEndDateChange(endDate, isDateChange){
        setSelectedEditEndDate(endDate);
        if(endDate !== null){
            setSelectedEditStartDate(startDate => {
                startDate.date(endDate.date());
                startDate.month(endDate.month());
                startDate.year(endDate.year());
                return startDate;
            });
        }
    }

    

    function handleParticipantDelete(participantId){
        setParticipations(participations => participations.filter((participation) => participation.participantId !== participantId))
    }

    function handleEditParticipantDelete(participantId){
        setEditParticipations(participations => participations.filter((participation) => participation.participantId !== participantId))
    }

    function handleParticipantAdd(){
        if(selectedParticipant != null){
            for(let i = 0; i < participations.length; i++){
                if(participations[i].participantId == selectedParticipant.id){
                    return;
                }
            }
            setParticipations(participations => 
                [...participations, {role: selectedParticipant.role, participantId: selectedParticipant.id, name: selectedParticipant.name, 
                    canLeaveFeedback: selectedParticipant.role === 'DEPARTMENT_ADMIN' ? true : false, 
                    canViewFeedback: selectedParticipant.role === 'DEPARTMENT_ADMIN' ? true : false}]);
            setSelectedParticipant(null);
        }
    }

    function handleEditParticipantAdd(){
        if(selectedEditParticipant != null){
            for(let i = 0; i < editParticipations.length; i++){
                if(editParticipations[i].participantId == selectedEditParticipant.id){
                    return;
                }
            }
            setEditParticipations(participations => 
                [...participations, {role: selectedEditParticipant.role, participantId: selectedEditParticipant.id, name: selectedEditParticipant.name, 
                    canLeaveFeedback: selectedEditParticipant.role === 'DEPARTMENT_ADMIN' ? true : false, 
                    canViewFeedback: selectedEditParticipant.role === 'DEPARTMENT_ADMIN' ? true : false}]);
            setSelectedEditParticipant(null);
        }
    }

    function handleCanViewFeedbackChange(value, i){
        setParticipations(participations => participations.map((participation => {
            if(participation.participantId == i){
                return {...participation, canViewFeedback: !participation.canViewFeedback}
            }
            else return participation
        })))
    }

    function handleEditCanViewFeedbackChange(value, i){
        setEditParticipations(participations => participations.map((participation => {
            if(participation.participantId == i){
                return {...participation, canViewFeedback: !participation.canViewFeedback}
            }
            else return participation
        })))
    }

    function handleCanLeaveFeedbackChange(value, i){
        setParticipations(participations => participations.map((participation => {
            if(participation.participantId == i){
                return {...participation, canLeaveFeedback: !participation.canLeaveFeedback}
            }
            else return participation
        })))
    }

    function handleEditCanLeaveFeedbackChange(value, i){
        setEditParticipations(participations => participations.map((participation => {
            if(participation.participantId == i){
                return {...participation, canLeaveFeedback: !participation.canLeaveFeedback}
            }
            else return participation
        })))
    }

    function handleMeetingTypeChange(type){
        setMeetingType(type);
    }

    function handleEditMeetingTypeChange(type){
        setEditMeetingType(type);
    }

    function handleCreateMeeting(){
        let composedStartDate = new moment();
        composedStartDate.seconds(0);
        composedStartDate.minute(selectedStartTime.minute());
        composedStartDate.hours(selectedStartTime.hours());
        composedStartDate.date(selectedDate.date());
        composedStartDate.month(selectedDate.month());
        composedStartDate.year(selectedDate.year());

        let composedEndDate = new moment();
        composedEndDate.seconds(0);
        composedEndDate.minute(selectedEndTime.minute());
        composedEndDate.hours(selectedEndTime.hours());
        composedEndDate.date(selectedDate.date());
        composedEndDate.month(selectedDate.month());
        composedEndDate.year(selectedDate.year());

        if(selectedLocation === null || selectedLocation === '' || selectedLocation === undefined){
            dispatch(setErrorMessage("Error: Must select a location."))
        }
        else if(participations.length == 0){
            dispatch(setErrorMessage("Error: Must select at least one participant."))
        }
        else if(selectedDate === null || composedStartDate.valueOf() >= composedEndDate.valueOf()){
            dispatch(setErrorMessage("Error: Start time must be before end time."))
        }
        else{
            dispatch(beginCreatingMeeting(schedule.id, selectedLocation.id, meetingType, 
            composedStartDate.utc().format('YYYY/MM/DD HH:mm:ss'), composedEndDate.utc().format('YYYY/MM/DD HH:mm:ss'), participations));
        }
        // setSelectedLocation(null);
        // setSelectedEndDate(new moment(new moment().format("YYYY/MM/DD")));
        // setSelectedStartDate(new moment(new moment().format("YYYY/MM/DD")));
        // setParticipations([]);
    }

    function handleSendEditMeeting(meeting){
        let composedStartDate = new moment();
        composedStartDate.seconds(0);
        composedStartDate.minute(selectedEditStartTime.minute());
        composedStartDate.hours(selectedEditStartTime.hours());
        composedStartDate.date(selectedEditDate.date());
        composedStartDate.month(selectedEditDate.month());
        composedStartDate.year(selectedEditDate.year());

        let composedEndDate = new moment();
        composedEndDate.seconds(0);
        composedEndDate.minute(selectedEditEndTime.minute());
        composedEndDate.hours(selectedEditEndTime.hours());
        composedEndDate.date(selectedEditDate.date());
        composedEndDate.month(selectedEditDate.month());
        composedEndDate.year(selectedEditDate.year());

        if(selectedEditLocation === null || selectedEditLocation === '' || selectedEditLocation === undefined){
            dispatch(setErrorMessage("Error: Must select a location."))
        }
        else if(editParticipations.length == 0){
            dispatch(setErrorMessage("Error: Must select at least one participant."))
        }
        else if(selectedEditDate === null || composedStartDate.valueOf() >= composedEndDate.valueOf()){
            dispatch(setErrorMessage("Error: Start time must be before end time."))
        }
        else{
            dispatch(beginEditingMeeting(meeting.id, selectedEditLocation.id, editMeetingType, 
            composedStartDate.utc().format('YYYY/MM/DD HH:mm:ss'), composedEndDate.utc().format('YYYY/MM/DD HH:mm:ss'), editParticipations));
        }
        // setSelectedLocation(null);
        // setSelectedEndDate(new moment(new moment().format("YYYY/MM/DD")));
        // setSelectedStartDate(new moment(new moment().format("YYYY/MM/DD")));
        // setParticipations([]);
    }

    function handleDeleteMeeting(meeting){
        if(window.confirm("Are you sure you want to delete this meeting?"))
            dispatch(beginDeletingMeeting(meeting.id));
    }


    return (
        <div className="choose-candidate-page-root">
            <Nav style='scheduler' />

            {/* TOP BAR AREA */}
            <div className="schedule-header">
                <span className="schedule-page-title">
                    <b className="schedule-candidate" onClick={()=>dispatch(setIsViewingUser(true, candidate.id))}><u>{candidate.name}</u></b>: {position.positionName} for {position.department !== null ? position.department.departmentName : "[DELETED]"} Department
                </span>
            </div>

            <div className="to-positions-link-container">
                <Link className="to-positions-link-scheduler" to='/test/meeting-scheduler'><span className="positions-back-arrow" style={{fontSize:'24px'}}>&#171;</span> To Positions Page</Link>
            </div>
            <div className="to-all-meetings-link-container">
                <Link className="to-all-meetings-link" to='/test/view-all-meetings'><span className="positions-back-arrow" style={{fontSize:'24px'}}>&#171;</span> View All Meetings</Link>
            </div>

            {/* NEW MEETINGS */}
            {!isCreatingMeeting &&
            <button className="create-meeting-open" onClick={()=>{
                dispatch(setErrorMessage(''));
                dispatch(setCreatingMeeting(true, false));
                }}>
            Create Meeting +
            </button>
            }
            {isCreatingMeeting &&
            <div className="creating-meeting-box">
                <div className="cancel-meeting-btn-container">
                    <button className="cancel-meeting-btn" onClick={()=>handleCancelMeetingCreation()}>Cancel Meeting</button>
                </div>
                <div>
                    <div className="meeting-type-container" >
                        <div onChange={(e)=>handleMeetingTypeChange(e.target.value)}>
                            <input type="radio" value='MEET_FACULTY' id="meeting-faculty" name="meeting-type" checked={meetingType=='MEET_FACULTY'} />
                            <label htmlFor="meeting-faculty">Meeting with Faculty</label>
                            <input type="radio" value='PRESENTATION' id="presentation-students" name="meeting-type" checked={meetingType=='PRESENTATION'}  />
                            <label htmlFor="presentation-students">Presentation to students</label>
                        </div>
                    </div>
                    <div className="location-container">
                        <Autocomplete
                        value={selectedLocation}
                        onChange={(event, location) => {
                            setSelectedLocation(location);
                        }}
                        id="location-selection-box"
                        options={locations}
                        getOptionLabel={(location) => location.buildingName + " - " + location.roomNumber.toString().padStart(3, '0')}
                        style={{ width: '100%' }}
                        renderInput={(params) => <TextField {...params} style={{}} label="Select location..." variant="outlined" />}
                        />
                    </div>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                            <div className="date-picker-container">
                                <div>
                                    <div className="start-time-container">
                                        <div>Start time: </div>
                                        <div>
                                        <DatePicker
                                        keyboard
                                        placeholder="MM/DD/YYYY"
                                        format={"MM/DD/YYYY"}
                                        // handle clearing outside => pass plain array if you are not controlling value outside
                                        // mask={value =>
                                        //     value
                                        //     ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]
                                        //     : []
                                        // }
                                        value={selectedDate}
                                        onChange={handleDateChange}                                        
                                        disableOpenOnEnter
                                        animateYearScrolling={false}
                                        autoOk={true}
                                        clearable
                                        />
                                        <div className="time-padding"></div>
                                        <TimePicker
                                        value={selectedStartTime}
                                        onChange={handleStartTimeChange}
                                        />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="end-time-container">
                                        <div>End time: </div>
                                        <div>
                                            <DatePicker
                                            keyboard
                                            placeholder="MM/DD/YYYY"
                                            format={"MM/DD/YYYY"}
                                            // handle clearing outside => pass plain array if you are not controlling value outside
                                            // mask={value =>
                                            //     value
                                            //     ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]
                                            //     : []
                                            // }
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            disableOpenOnEnter
                                            animateYearScrolling={false}
                                            autoOk={true}
                                            clearable
                                            />
                                            <div className="time-padding"></div>
                                            <TimePicker
                                            value={selectedEndTime}
                                            onChange={handleEndTimeChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </MuiPickersUtilsProvider>
                    
                    <div className="participants-container"> 
                        <div className="participant-selection-container">
                            <button className="add-participant-btn" onClick={handleParticipantAdd}>Add</button>
                            <Autocomplete
                                value={selectedParticipant}
                                onChange={(event, participant) => {
                                    setSelectedParticipant(participant)
                                }}
                                id="participant-selection-box"
                                options={participants}
                                getOptionLabel={(participants) => participants.name}
                                style={{width: '100%'}}
                                renderInput={(params) => <TextField {...params} style={{}} label="Select participant..." variant="outlined" />}
                            />   
                        </div>                   
                        {participations.map( (participation, i) => 
                        <div className="participant-row" key={i}>
                            <button className="participant-delete-btn" onClick={()=>handleParticipantDelete(participation.participantId)}>Delete</button>
                            <span className="participant-name">{participation.name}</span>
                            
                            {participation.role !== 'DEPARTMENT_ADMIN' &&
                            <span>
                                <input className="can-view-feedback-box" type="checkbox" onChange={(e) => handleCanViewFeedbackChange(e.target.value, participation.participantId)} id={`canViewFeedback${i}`} name="canViewFeedback"></input>
                                <span>Can view feedback</span>
                                <input type="checkbox" onChange={(e) => handleCanLeaveFeedbackChange(e.target.value, participation.participantId)} id={`canLeaveFeedback${i}`} name="canLeaveFeedback"></input>
                                <span>Can leave feedback</span>
                                <span>{participation.canViewFeedback}</span>
                            </span>
                            }
                            {participation.role === 'DEPARTMENT_ADMIN' &&
                            <span>
                                <input disabled checked className="can-view-feedback-box" type="checkbox"  id={`canViewFeedback${i}`} name="canViewFeedback"></input>
                                <span>Can view feedback</span>
                                <input disabled checked type="checkbox" id={`canLeaveFeedback${i}`} name="canLeaveFeedback"></input>
                                <span>Can leave feedback</span>
                                <span>{participation.canViewFeedback}</span>
                            </span>
                            }
                        </div>
                        )} 
                        <div className="meeting-creation-error-msg">
                            {errorMsg}
                        </div>   
                    </div>
                </div>
                <div className="create-meeting-btn-container">
                    <button onClick={handleCreateMeeting}>Create Meeting</button>
                </div>
            </div>
            }

            <div className="meeting-boxes-container">
                <div className="meeting-boxes-header">Meetings</div>
                {Object.keys(meetings).map((meetingDate, i) => (
                    <div key={i}>
                        <div className="meeting-date">{meetingDate}</div>
                        {meetings[meetingDate].map((meeting, j) => {
                        if(!isEditingMeeting || isEditingIndex1 !== i || isEditingIndex2 !== j) return (
                        <div key={j} className="view-meetings-meeting-box">
                                    
                        {/* PARTICIPANT FEEDBACK CONTROLS */}
                        <div className="meeting-box-feedback-btns-container">
                            <button className="scheduler-delete-meeting-btn" onClick={()=>handleDeleteMeeting(meeting)}>Delete</button>
                            <button className="scheduler-delete-meeting-btn" onClick={()=>handleEditMeeting(meeting, i, j)}>Edit</button>
                        </div>
                        {/*********************************/}

                        {/* MEETING-BOX-CONTENTS */}
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
                            <div className="meeting-item-value">{moment.utc(meeting.startTime).local().format('h:mmA')} - {moment.utc(meeting.endTime).local().format('h:mmA')}</div>
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
                    )
                else return (
                <div key={j}>
                    <div className="creating-meeting-box">
                        <div className="cancel-meeting-btn-container">
                            <button className="cancel-meeting-btn" onClick={()=>handleCancelMeetingEdit()}>Cancel Edit</button>
                        </div>
                    <div>
                    <div className="meeting-type-container" >
                        <div onChange={(e)=>handleEditMeetingTypeChange(e.target.value)}>
                            <input type="radio" value='MEET_FACULTY' id="meeting-faculty" name="meeting-type" checked={editMeetingType=='MEET_FACULTY'} />
                            <label htmlFor="meeting-faculty">Meeting with Faculty</label>
                            <input type="radio" value='PRESENTATION' id="presentation-students" name="meeting-type" checked={editMeetingType=='PRESENTATION'}  />
                            <label htmlFor="presentation-students">Presentation to students</label>
                        </div>
                    </div>
                    <div className="location-container">
                        <Autocomplete
                        value={selectedEditLocation}
                        onChange={(event, location) => {
                            setSelectedEditLocation(location);
                        }}
                        id="location-selection-box"
                        options={locations}
                        getOptionLabel={(location) => location.buildingName + " - " + location.roomNumber.toString().padStart(3, '0')}
                        style={{ width: '100%' }}
                        renderInput={(params) => <TextField {...params} style={{}} label="Select location..." variant="outlined" />}
                        />
                    </div>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                            <div className="date-picker-container">
                                <div>
                                    <div className="start-time-container">
                                        <div>Start time: </div>
                                        <div>
                                        <DatePicker
                                        keyboard
                                        placeholder="MM/DD/YYYY"
                                        format={"MM/DD/YYYY"}
                                        // handle clearing outside => pass plain array if you are not controlling value outside
                                        // mask={value =>
                                        //     value
                                        //     ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]
                                        //     : []
                                        // }
                                        value={selectedEditDate}
                                        onChange={handleEditDateChange}                                        
                                        disableOpenOnEnter
                                        animateYearScrolling={false}
                                        autoOk={true}
                                        clearable
                                        />
                                        <div className="time-padding"></div>
                                        <TimePicker
                                        value={selectedEditStartTime}
                                        onChange={handleEditStartTimeChange}
                                        />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="end-time-container">
                                        <div>End time: </div>
                                        <div>
                                            <DatePicker
                                            keyboard
                                            placeholder="MM/DD/YYYY"
                                            format={"MM/DD/YYYY"}
                                            // handle clearing outside => pass plain array if you are not controlling value outside
                                            // mask={value =>
                                            //     value
                                            //     ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]
                                            //     : []
                                            // }
                                            value={selectedEditDate}
                                            onChange={handleEditDateChange}
                                            disableOpenOnEnter
                                            animateYearScrolling={false}
                                            autoOk={true}
                                            clearable
                                            />
                                            <div className="time-padding"></div>
                                            <TimePicker
                                            value={selectedEditEndTime}
                                            onChange={handleEditEndTimeChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </MuiPickersUtilsProvider>
                    <div className="participants-container"> 
                        <div className="participant-selection-container">
                            <button className="add-participant-btn" onClick={handleEditParticipantAdd}>Add</button>
                            <Autocomplete
                                value={selectedEditParticipant}
                                onChange={(event, participant) => {
                                    setSelectedEditParticipant(participant)
                                }}
                                id="participant-selection-box"
                                options={participants}
                                getOptionLabel={(participants) => participants.name}
                                style={{width: '100%'}}
                                renderInput={(params) => <TextField {...params} style={{}} label="Select participant..." variant="outlined" />}
                            />   
                        </div>                   
                        {editParticipations.map( (participation, i) => 
                        <div className="participant-row" key={i}>
                            <button className="participant-delete-btn" onClick={()=>handleEditParticipantDelete(participation.participantId)}>Delete</button>
                            <span className="participant-name">{participation.name}</span>
                            
                            {participation.role !== 'DEPARTMENT_ADMIN' &&
                            <span>
                                <input checked={participation.canViewFeedback} className="can-view-feedback-box" type="checkbox" onChange={(e) => handleEditCanViewFeedbackChange(e.target.value, participation.participantId)} id={`canViewFeedback${i}`} name="canViewFeedback"></input>
                                <span>Can view feedback</span>
                                <input check={participation.canLeaveFeedback} type="checkbox" onChange={(e) => handleEditCanLeaveFeedbackChange(e.target.value, participation.participantId)} id={`canLeaveFeedback${i}`} name="canLeaveFeedback"></input>
                                <span>Can leave feedback</span>
                                <span>{participation.canViewFeedback}</span>
                            </span>
                            }
                            {participation.role === 'DEPARTMENT_ADMIN' &&
                            <span>
                                <input disabled checked className="can-view-feedback-box" type="checkbox"  id={`canViewFeedback${i}`} name="canViewFeedback"></input>
                                <span>Can view feedback</span>
                                <input disabled checked type="checkbox" id={`canLeaveFeedback${i}`} name="canLeaveFeedback"></input>
                                <span>Can leave feedback</span>
                                <span>{participation.canViewFeedback}</span>
                            </span>
                            }
                        </div>
                        )} 
                        <div className="meeting-creation-error-msg">
                            {errorMsg}
                        </div>   
                    </div>
                </div>
                <div className="create-meeting-btn-container">
                    <button onClick={()=>handleSendEditMeeting(meeting)}>Edit Meeting</button>
                </div>
            </div>
                        </div>
                    )
                    }
                        )}
                    </div>
                ))}
            {schedule.meetings && schedule.meetings.length === 0 &&
                <div className = "nothing-to-show">
                    No meetings...
                </div>


            }
            </div>
            

        </div>
    )
}

export default ViewSchedulePage;