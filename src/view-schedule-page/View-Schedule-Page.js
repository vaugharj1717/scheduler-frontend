import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Switch, Route, Link} from 'react-router-dom';
import './View-Schedule-Page.css';
import {beginDeletingMeeting, beginCreatingMeeting, beginGettingSchedule, beginGettingLocations, beginGettingParticipants} from '../actions.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
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

function ViewSchedulePage(props) {
    const classes = useStyles();

    let schedule = useSelector(state => state.currentSchedule);
    let locations = useSelector(state => state.locations);

    let [selectedLocation, setSelectedLocation] = useState(null);
    let [selectedStartDate, setSelectedStartDate] = useState(new moment(new moment().format("YYYY/MM/DD")));
    let [meetingType, setMeetingType] = useState('MEET_FACULTY')
    let [selectedEndDate, setSelectedEndDate] = useState(new moment(new moment().format("YYYY/MM/DD")));
    let [participations, setParticipations] = useState([]);
    let [isCreatingMeeting, setCreatingMeeting] = useState(false);

    //handling participants
    let [selectedParticipant, setSelectedParticipant] = useState(null);
    let participants = useSelector(state => state.participants);

    //let meetingsGroupedByDate = groupMeetingsByDate(schedule.meetings);

    console.log(props.candidacy);

    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(beginGettingSchedule(props.candidacy.schedule.id))
    }, []);

    function handleCancelMeetingCreation(){
        setCreatingMeeting(false);
        setSelectedLocation(null);
        setSelectedStartDate(new moment());
        setSelectedEndDate(new moment());
        setParticipations([]);
    }

    function handleStartDateChange(startDate){
        setSelectedStartDate(startDate);
        setSelectedEndDate(endDate => {
            endDate.date(startDate.date());
            endDate.month(startDate.month());
            endDate.year(startDate.year());
            return endDate;
        })
    }

    function handleEndDateChange(endDate){
        setSelectedEndDate(endDate);
        setSelectedStartDate(startDate => {
            startDate.date(endDate.date());
            startDate.month(endDate.month());
            startDate.year(endDate.year());
            return startDate;
        })
    }

    function handleParticipantDelete(participantId){
        setParticipations(participations => participations.filter((participation) => participation.participantId !== participantId))
    }

    function handleParticipantAdd(){
        for(let i = 0; i < participations.length; i++){
            if(participations[i].participantId == selectedParticipant.id){
                return;
            }
        }
        setParticipations(participations => 
            [...participations, {participantId: selectedParticipant.id, name: selectedParticipant.name, canLeaveFeedback: false, canViewFeedback: false}]);
        setSelectedParticipant(null);
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
        if(selectedLocation == null || participations.length == 0){
            return;
        }
        dispatch(beginCreatingMeeting(schedule.id, selectedLocation.id, meetingType, 
            selectedStartDate.format('YYYY/MM/DD hh:mm:ss'), selectedEndDate.format('YYYY/MM/DD hh:mm:ss'), participations));
        setCreatingMeeting(false);
        setSelectedLocation(null);
        setSelectedEndDate(new moment(new moment().format("YYYY/MM/DD")));
        setSelectedStartDate(new moment(new moment().format("YYYY/MM/DD")));
        setParticipations([]);
    }

    function handleDeleteMeeting(meeting){
        dispatch(beginDeletingMeeting(meeting.id));
    }


    return (
        <div className="choose-candidate-page-root">
            <div id="menu-nav">
                &#9776;
            </div>

            {/* TOP BAR AREA */}
            <div id="header">
                <span id="page-title">
                    Meetings
                </span>
                <span id="sorting-label">
                    for {props.candidacy.candidate.name}
                </span>
            </div>

            <div>
                <Link to='/meeting-scheduler'>Back to Positions</Link>
            </div>

            {/* NEW MEETINGS */}
            {!isCreatingMeeting &&
            <button className="create-meeting-open" onClick={()=>{
                setCreatingMeeting(true);
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
                        <div className="participant-row" key={participation.id}>
                            <button className="participant-delete-btn" onClick={()=>handleParticipantDelete(participation.participantId)}>Delete</button>
                            <span className="participant-name">{participation.name}</span>
                            <input className="can-view-feedback-box" type="checkbox" onChange={(e) => handleCanViewFeedbackChange(e.target.value, participation.participantId)} id={`canViewFeedback${i}`} name="canViewFeedback"></input>
                            <span>Can view feedback</span>
                            <input type="checkbox" onChange={(e) => handleCanLeaveFeedbackChange(e.target.value, participation.participantId)} id={`canLeaveFeedback${i}`} name="canLeaveFeedback"></input>
                            <span>Can leave feedback</span>
                            <span>{participation.canViewFeedback}</span>
                        </div>
                        )}    
                    </div>
                </div>
                <div className="create-meeting-btn-container">
                    <button onClick={handleCreateMeeting}>Create Meeting</button>
                </div>
            </div>
            }

            <div className="meeting-boxes-container">
                <div className="meeting-boxes-header">Meetings</div>
                {schedule.loaded && schedule.meetings.length !== 0 && schedule.meetings.map((meeting, i) => 
                <div className = "meeting-box" key={i}>
                    {meeting.meetingType === 'MEET_FACULTY' &&
                    <div>
                        <span className="meeting-delete-btn" onClick={()=>handleDeleteMeeting(meeting)}>X</span>
                        Meeting at <b>{meeting.location.buildingName} {meeting.location.roomNumber}</b> on <b>{new moment(meeting.startTime).format('YYYY/MM/DD')}</b> 
                        &nbsp;from <b>{new moment(meeting.startTime).format('hh:mmA')}</b> to <b>{new moment(meeting.endTime).format('hh:mmA')}</b>
                        <div></div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Attendees: </b>
                        {meeting.participations.map((participation, i, arr) => 
                            <span key={i}>
                                {participation.participant.name}, &nbsp;
                            </span>
                        )}
                    </div>
                    }
                    {meeting.meetingType !== 'MEET_FACULTY' &&
                    <div>
                        <span className="meeting-delete-btn" onClick={()=>handleDeleteMeeting(meeting)}>X</span>
                        Presenting to students at <b>{meeting.location.buildingName} {meeting.location.roomNumber}</b> on <b>{new moment(meeting.startTime).format('YYYY/MM/DD')}</b> 
                        &nbsp;from <b>{new moment(meeting.startTime).format('hh:mmA')}</b> to <b>{new moment(meeting.endTime).format('hh:mmA')}</b>
                        <div></div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Attendees: </b>
                        {meeting.participations.map((participation, i, arr) => 
                            <span key={i}>
                                {participation.participant.name}, &nbsp;
                            </span>
                        )}
                    </div>
                    }
                </div>
            )}
            {schedule.meetings.length === 0 &&
                <div className = "nothing-to-show">
                    No meetings...
                </div>


            }
            </div>
            

        </div>
    )
}

export default ViewSchedulePage;