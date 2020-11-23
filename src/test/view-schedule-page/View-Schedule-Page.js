import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Switch, Route, Link} from 'react-router-dom';
import './View-Schedule-Page.css';
import {setErrorMessage, setCreatingMeeting, beginDeletingMeeting, beginCreatingMeeting, beginGettingSchedule, 
    beginGettingLocations, beginGettingParticipants, setIsViewingUser} from '../../actions.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Nav from '../nav/Nav.js';
import moment from 'moment';
import {makeStyles, createMuiTheme} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {ThemeProvider, withStyles } from "@material-ui/core/styles";
import MomentUtils from "@date-io/moment";
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
        let dateString = new moment(curr.startTime).utcOffset('+0000').format('dddd MMM D, YYYY');
        if(!(dateString in acc))
            acc[dateString] = []
        acc[dateString].push(curr);
        return acc;
    }, {});
}

function ViewSchedulePage(props) {
    const classes = useStyles();
    
    let candidate = props.candidacy.candidate;
    let position = props.position;
    let schedule = useSelector(state => state.currentSchedule);
    let locations = useSelector(state => state.locations);
    let errorMsg = useSelector(state => state.errorMessage);
    let meetings = schedule.loaded === true ? groupMeetingsByDate(schedule.meetings) : [];

    let [selectedLocation, setSelectedLocation] = useState(null);
    let [selectedStartDate, setSelectedStartDate] = useState(new moment(new moment().format("YYYY/MM/DD")));
    let [meetingType, setMeetingType] = useState('MEET_FACULTY')
    let [selectedEndDate, setSelectedEndDate] = useState(new moment(new moment().format("YYYY/MM/DD")));
    let [participations, setParticipations] = useState([]);
    // let [isCreatingMeeting, setCreatingMeeting] = useState(false);
    let isCreatingMeeting = useSelector(state => state.isCreatingMeeting);

    //handling participants
    let [selectedParticipant, setSelectedParticipant] = useState(null);
    let participants = useSelector(state => state.participants);

    //let meetingsGroupedByDate = groupMeetingsByDate(schedule.meetings);

    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(beginGettingSchedule(props.candidacy.schedule.id))
    }, []);

    useEffect(()=>{
        setSelectedLocation(null);
        setSelectedEndDate(new moment(new moment().format("YYYY/MM/DD")));
        setSelectedStartDate(new moment(new moment().format("YYYY/MM/DD")));
        setParticipations([]);
    }, [schedule]);

    function handleCancelMeetingCreation(){
        dispatch(setCreatingMeeting(false));
        setSelectedLocation(null);
        setSelectedStartDate(new moment());
        setSelectedEndDate(new moment());
        setParticipations([]);
    }

    function handleStartDateChange(startDate, isDateChange){
        setSelectedStartDate(startDate);
        if(isDateChange){
            setSelectedEndDate(endDate => {
            endDate.date(startDate.date());
            endDate.month(startDate.month());
            endDate.year(startDate.year());
            return endDate;
        })}
    }

    function handleEndDateChange(endDate, isDateChange){
        setSelectedEndDate(endDate);
        if(isDateChange){
            setSelectedStartDate(startDate => {
                startDate.date(endDate.date());
                startDate.month(endDate.month());
                startDate.year(endDate.year());
                return startDate;
        })}
    }

    function handleParticipantDelete(participantId){
        setParticipations(participations => participations.filter((participation) => participation.participantId !== participantId))
    }

    function handleParticipantAdd(){
        if(selectedParticipant != null){
            for(let i = 0; i < participations.length; i++){
                if(participations[i].participantId == selectedParticipant.id){
                    return;
                }
            }
            setParticipations(participations => 
                [...participations, {participantId: selectedParticipant.id, name: selectedParticipant.name, canLeaveFeedback: false, canViewFeedback: false}]);
            setSelectedParticipant(null);
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

    function handleCanLeaveFeedbackChange(value, i){
        setParticipations(participations => participations.map((participation => {
            if(participation.participantId == i){
                return {...participation, canLeaveFeedback: !participation.canLeaveFeedback}
            }
            else return participation
        })))
    }

    function handleMeetingTypeChange(type){
        setMeetingType(type);
    }

    function handleCreateMeeting(){
        if(selectedLocation === null || selectedLocation === '' || selectedLocation === undefined){
            dispatch(setErrorMessage("Error: Must select a location."))
        }
        else if(participations.length == 0){
            dispatch(setErrorMessage("Error: Must select at least one participant."))
        }
        else if(selectedStartDate.valueOf() >= selectedEndDate.valueOf()){
            dispatch(setErrorMessage("Error: Start time must be before end time."))
        }
        else{
            dispatch(beginCreatingMeeting(schedule.id, selectedLocation.id, meetingType, 
            selectedStartDate.format('YYYY/MM/DD HH:mm:ss'), selectedEndDate.format('YYYY/MM/DD HH:mm:ss'), participations));
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
                    <b className="schedule-candidate" onClick={()=>dispatch(setIsViewingUser(true, candidate.id))}><u>{candidate.name}</u></b>: {position.positionName} for {position.department.departmentName} Department
                </span>
            </div>

            <div className="to-positions-link-container">
                <Link className="to-positions-link" to='/test/meeting-scheduler'><span className="positions-back-arrow" style={{fontSize:'24px'}}>&#171;</span> Back to Positions</Link>
            </div>

            {/* NEW MEETINGS */}
            {!isCreatingMeeting &&
            <button className="create-meeting-open" onClick={()=>{
                dispatch(setCreatingMeeting(true));
                dispatch(beginGettingLocations())
                dispatch(beginGettingParticipants())
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
                        getOptionLabel={(location) => location.buildingName + " - " + location.roomNumber}
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
                                        value={selectedStartDate}
                                        onChange={handleStartDateChange}                                        
                                        disableOpenOnEnter
                                        animateYearScrolling={false}
                                        autoOk={true}
                                        clearable
                                        />
                                        <div className="time-padding"></div>
                                        <TimePicker
                                        value={selectedStartDate}
                                        onChange={handleStartDateChange}
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
                                            value={selectedEndDate}
                                            onChange={handleEndDateChange}
                                            disableOpenOnEnter
                                            animateYearScrolling={false}
                                            autoOk={true}
                                            clearable
                                            />
                                            <div className="time-padding"></div>
                                            <TimePicker
                                            value={selectedEndDate}
                                            onChange={handleEndDateChange}
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
                            <input className="can-view-feedback-box" type="checkbox" onChange={(e) => handleCanViewFeedbackChange(e.target.value, participation.participantId)} id={`canViewFeedback${i}`} name="canViewFeedback"></input>
                            <span>Can view feedback</span>
                            <input type="checkbox" onChange={(e) => handleCanLeaveFeedbackChange(e.target.value, participation.participantId)} id={`canLeaveFeedback${i}`} name="canLeaveFeedback"></input>
                            <span>Can leave feedback</span>
                            <span>{participation.canViewFeedback}</span>
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
                        {meetings[meetingDate].map((meeting, i) => 
                        <div key={i} className="view-meetings-meeting-box">
                                    
                        {/* PARTICIPANT FEEDBACK CONTROLS */}
                        <div className="meeting-box-feedback-btns-container">
                            <button className="scheduler-delete-meeting-btn" onClick={()=>handleDeleteMeeting(meeting)}>Delete</button>
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
                            <div className="meeting-item-value">{new moment(meeting.startTime).utcOffset('+0000').format('h:mmA')} - {new moment(meeting.endTime).utcOffset('+0000').format('h:mmA')}</div>
                        </div>
                        <div className="meeting-box-item">
                            <div className="meeting-item-label">Location: </div>
                            <div className="meeting-item-value">{meeting.location.buildingName} {meeting.location.roomNumber}</div>
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