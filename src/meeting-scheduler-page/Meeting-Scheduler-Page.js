import React, {useEffect, useState} from 'react';
import './Meeting-Scheduler-Page.css';
import {useSelector, useDispatch} from 'react-redux';
import {beginDeletingSchedule, beginSavingCandidate, beginDeletingCandidacy, beginGettingDepartments, beginCreatingPosition, beginDeletingPosition,
    beginGettingPositions, beginGettingCandidates, beginAssigningCandidateToPosition} from '../actions.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

function MeetingSchedulerPage() {
    //useState: let [trackedValue, setterFuncForTrackedValue] = useState(initialValue)
    let [creatingCandidate, setCreatingCandidate] = useState(false);
    let [decidingCandidateSelectMode, setDecidingCandidateSelectMode] = useState(false);
    let [selectingCandidate, setSelectingCandidate] = useState(false);
    let [selectedCandidate, setSelectedCandidate] = useState(null);
    let [addingNewPosition, setAddingNewPosition] = useState(false);
    let [selectedDepartment, setSelectedDepartment] = useState(null);
    let [focusedPositionIndex, setFocusedPositionIndex] = useState(-1);

    let [name, setName] = useState('');
    let [email, setEmail] = useState('');
    let [positionName, setPositionName] = useState('');
    
    //test
    console.log(selectedDepartment);

    const dispatch = useDispatch();
    let positions = useSelector(state => state.positions);
    let candidates = useSelector(state => state.candidates);
    let departments = useSelector(state => state.departments);

    useEffect(()=>dispatch(beginGettingPositions()), [dispatch]);
      
    //check if valid input
    let isValidInput;
    if(name.match('^[a-zA-Z|\\.|\\s]+$') && email.match('^[a-zA-Z|0-9]+@[a-zA-Z|0-9]+$')) isValidInput = true;
    else isValidInput = false;

    
    function handleCancel(){
        //set creatingCandidate to false
        setCreatingCandidate(false);
        setDecidingCandidateSelectMode(false);
        setSelectingCandidate(false);
        //clear input fields
        setName('');
        setEmail('');
    }

    function handleCancelCreatingPosition(){
        setAddingNewPosition(false);
        setSelectedDepartment(null);
    }

    function handleNewCandidateSelect(){
        setDecidingCandidateSelectMode(false);
        setSelectingCandidate(false);
        setCreatingCandidate(true);
    }

    function handleAddCandidate(index){
        setDecidingCandidateSelectMode(true);
        setCreatingCandidate(false);
        setSelectingCandidate(false);
        setFocusedPositionIndex(index)
    }

    function handleCandidacyDelete(candidacyId){
        dispatch(beginDeletingCandidacy(candidacyId))
    }

    function handleScheduleDelete(scheduleId){
        dispatch(beginDeletingSchedule(scheduleId));
    }

    function handleSaveCandidate(positionId, name, email){
        dispatch(beginSavingCandidate(positionId, name, email));
        //set creatingCandidate to false
        setCreatingCandidate(false);
        setDecidingCandidateSelectMode(false);
        //clear input fields
        setName('');
        setEmail('');
    }

    function handleExistingCandidateSelect(){
        setCreatingCandidate(false);
        setDecidingCandidateSelectMode(false);
        setSelectingCandidate(true);
        dispatch(beginGettingCandidates());
    }

    function handleAssignCandidateToPosition(positionId, candidateId){
        setSelectedCandidate(null);
        setCreatingCandidate(false);
        setDecidingCandidateSelectMode(false);
        setSelectingCandidate(false);
        dispatch(beginAssigningCandidateToPosition(positionId, candidateId));
    }

    function handleAddNewPosition(){
        setAddingNewPosition(true);
        dispatch(beginGettingDepartments());
    }

    function handleCreatePosition(positionName, departmentId){
        setAddingNewPosition(false);
        setSelectedDepartment(null);
        dispatch(beginCreatingPosition(positionName, departmentId))
    }

    function handleDeletePosition(positionId){
        dispatch(beginDeletingPosition(positionId));
    }
    
    return(
        <div className="meeting-scheduler-page-root">
            {/* MENU NAV BUTTON */}
            <div id="menu-nav">
                    &#9776;
            </div>

            {/* TOP BAR AREA */}
            <div id="header">
                <span id="page-title">
                    All Positions
                </span>
                <span id="sorting-label">
                    Sort By
                </span>
            </div>

	        {/* PANEL INSTANCE SHOWING OPEN POSITIONS */}
            {positions.map((position, i) => {return (
            <div className="positions-panel" key={i}>
                <button onClick={()=>handleDeletePosition(position.id)}>DELETE POSITION</button>
                <div className="positions-label">
                    <span className="b">{position.positionName}</span> for the <span className="b">{position.department.departmentName}</span> Department (124434345)
                </div>
                <div className="scrollbox">
                    <table className="positions-table">
                        <thead>
                        <tr id="catagories" style={{textTransform: 'uppercase'}}>
                            <td>Name</td>
                            <td>Email</td>
                            <td>Attachments</td>
                            <td>Meeting Schedule</td>
                            <td>Modify</td>
                        </tr>
                        </thead>

                        <tbody>
                        {/* CANDIDATE INSTANCE */}
                        {position.candidacies.map(candidacy => {return (
                        <tr key={candidacy.id}>
                            <td>{candidacy.candidate.name}</td>
                            <td>{candidacy.candidate.email}</td>
                            <td><u><b>View Attachments</b></u></td>
                            {candidacy.schedule != null &&
                            <td><u><b>View</b></u> / <u><b>Edit</b></u> / <u><b><div onClick={()=>handleScheduleDelete(candidacy.schedule.id)}>Delete</div></b></u></td>
                            }
                            {candidacy.schedule == null &&
                            <td><u><b>Create</b></u></td>
                            }
                            <td><u><b><div onClick={()=>handleCandidacyDelete(candidacy.id)}>Delete</div></b></u></td>

                        </tr>
                        )})}
                        {/* END OF CANDIDATE INSTANCE */}

                        {creatingCandidate && focusedPositionIndex === i &&
                        <tr id="catagories">
                            <td style={{padding:'0px',borderWidth:'0px'}}>
                                <textarea value={name} onChange={e => {setName(e.target.value)}} id="w3review" name="w3review" style={{width: '98%', resize: 'none'}}></textarea>
                            </td>
                            <td style={{padding:'0px',borderWidth:'0px'}}>
                                <textarea value={email} onChange={e => {setEmail(e.target.value)}} id="w3review" name="w3review" style={{width: '98%', resize: 'none'}}></textarea>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        }
                        </tbody>
                    </table>
                </div>
            
            {decidingCandidateSelectMode && focusedPositionIndex === i && 
            <div className="more-buttons-container">
                    <button className="button button1" onClick={()=> handleExistingCandidateSelect()} style={{marginLeft: '3%', marginBottom: '10px'}}>EXISTING CANDIDATE</button>
                    <button className="button button1" onClick={()=> handleNewCandidateSelect()} style={{marginLeft: '1.5%', marginRight:'1.5%', marginBottom: '10px'}}>NEW CANDIDATE +</button>
                    <button className="button cancel-button" onClick={()=> handleCancel()} style={{marginRight: '3%', marginBottom: '10px'}}>CANCEL</button>
            </div>
            }
            {creatingCandidate && focusedPositionIndex === i &&
            <div className="more-buttons-container">
                {isValidInput &&
                <button className="button save-button" onClick={()=>handleSaveCandidate(position.id, name, email)} style={{marginLeft: '3%', marginBottom: '10px', backgroundColor:'green'}}>SAVE</button>
                }
                {!isValidInput &&
                <button className="button save-button" style={{marginLeft: '3%', marginBottom: '10px', backgroundColor:'gray', cursor:'default'}}>SAVE</button>
                }
                <button className="button cancel-button" onClick={()=> handleCancel()} style={{marginLeft: '1%', marginRight: '3%', marginBottom: '10px'}}>CANCEL</button>

            </div>
            }

            {selectingCandidate && focusedPositionIndex === i &&
            <div className="more-buttons-container">
                <Autocomplete
                value={selectedCandidate}
                onChange={(event, selectedCandidate) => {
                  setSelectedCandidate(selectedCandidate);
                }}
                id="candidate-selection-box"
                options={candidates}
                getOptionLabel={(option) => option.name}
                style={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} style={{marginLeft:"10%", width:'95%', marginBottom:'5px'}} label="Select candidate..." variant="outlined" />}
                />
                {selectedCandidate != null &&
                <button className="button save-button" onClick={()=>handleAssignCandidateToPosition(position.id, selectedCandidate.id)} style={{marginLeft: '3%', marginBottom: '10px', backgroundColor:'green'}}>SAVE</button>
                }
                {selectedCandidate == null &&
                <button className="button save-button" style={{marginLeft: '3%', marginBottom: '10px', backgroundColor:'gray', cursor:'default'}}>SAVE</button>
                }
                <button className="button cancel-button" onClick={()=> handleCancel()} style={{marginLeft: '1%', marginRight: '3%', marginBottom: '10px'}}>CANCEL</button>
            </div>
            }

            {(focusedPositionIndex !== i || (!creatingCandidate && !decidingCandidateSelectMode && !selectingCandidate)) && 
            <div className="positions-button-container">
                <button className="button button1" onClick={()=> handleAddCandidate(i)}>Add Candidate +</button>
            </div>
            }
            </div>
            )})}
            {/* END OF PANEL INSTANCE SHOWING OPEN POSITIONS */}
            
            
            {!addingNewPosition &&
            <div className="more-buttons-container">
                <button className="button button2" onClick={()=>handleAddNewPosition()}>Add New Position +</button>
                <button className="button button3">View All Meetings (EYE)</button>
            </div>
            }
            {addingNewPosition &&
            <div className="more-buttons-container">
                <TextField value={positionName} onChange={(e)=>setPositionName(e.target.value)} label="Position name..." />
                <Autocomplete
                value={selectedDepartment}
                onChange={(event, selectedDepartment) => {
                  setSelectedDepartment(selectedDepartment);
                }}
                id="department-selection-box"
                options={departments}
                getOptionLabel={(option) => option.departmentName}
                style={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} style={{marginLeft:"10%", width:'95%', marginBottom:'5px'}} label="Select department..." variant="outlined" />}
                />
                {selectedDepartment !== null && positionName !== '' &&
                <button className="button save-button" onClick={()=> handleCreatePosition(positionName, selectedDepartment.id)} style={{marginLeft: '3%', marginBottom: '10px', backgroundColor:'green', cursor:'default'}}>SAVE</button>
                }
                {(selectedDepartment === null || positionName === '') &&
                <button className="button save-button" style={{marginLeft: '3%', marginBottom: '10px', backgroundColor:'gray', cursor:'default'}}>SAVE</button>
                }
                <button className="button cancel-button" onClick={()=> {handleCancelCreatingPosition()}} style={{marginLeft: '1%', marginRight: '3%', marginBottom: '10px'}}>CANCEL</button>
            </div>
            }
        </div>
        
    
    )
}

export default MeetingSchedulerPage