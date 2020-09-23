import React, {useState} from 'react';
import './Meeting-Scheduler-Page.css';

function MeetingSchedulerPage() {
    //useState: let [trackedValue, setterFuncForTrackedValue] = useState(initialValue)
    let [creatingCandidate, setCreatingCandidate] = useState(false);
    let [decidingCandidateSelectMode, setDecidingCandidateSelectMode] = useState(false);
    let [name, setName] = useState('');
    let [email, setEmail] = useState('');

    //check if valid input
    let isValidInput;
    if(name.match('^[a-zA-Z|\\.|\\s]+$') && email.match('^[a-zA-Z|0-9]+@[a-zA-Z|0-9]+$')) isValidInput = true;
    else isValidInput = false;

    
    function handleCancel(){
        //set creatingCandidate to false
        setCreatingCandidate(false);
        setDecidingCandidateSelectMode(false);
        //clear input fields
        setName('');
        setEmail('');
    }

    function handleNewCandidateSelect(){
        setDecidingCandidateSelectMode(false);
        setCreatingCandidate(true);
    }

    function handleAddCandidate(){
        setDecidingCandidateSelectMode(true);
        setCreatingCandidate(false);
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
            <div className="positions-panel">
                <div className="positions-label">
                    <span className="b">Assistant Professor</span> for the <span className="b">CS</span> Department (124434345)
                </div>
                <div className="scrollbox">
                    <table className="positions-table">
                        <tr id="catagories" style={{textTransform: 'uppercase'}}>
                            <td>Name</td>
                            <td>Email</td>
                            <td>Attachments</td>
                            <td>Meeting Schedule</td>
                            <td>Modify</td>
                        </tr>

                        <tr>
                            <td>John E. Doe</td>
                            <td>john@gmail.com</td>
                            <td><u><b>View Attachments</b></u></td>
                            <td><u><b>View</b></u> / <u><b>Edit</b></u> / <u><b>Delete</b></u></td>
                            <td><u><b>Edit</b></u> / <u><b>Delete</b></u></td>
                        </tr>

                        <tr>
                            <td>Jenny B. Doe</td>
                            <td>jenny@gmail.com</td>
                            <td>No Attachments</td>
                            <td><u><b>Create</b></u></td>
                            <td><u><b>Edit</b></u> / <u><b>Delete</b></u></td>
                        </tr>
                        {creatingCandidate &&
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
                    </table>
                </div>
            
            {decidingCandidateSelectMode &&
            <div className="more-buttons-container">
                    <button className="button button2" onClick={()=> {}} style={{marginLeft: '3%', marginBottom: '10px', backgroundColor:'#0e1826', color: '#f2f2f2'}}>EXISTING CANDIDATE</button>
                    <button className="button button3" onClick={()=> handleNewCandidateSelect()} style={{marginLeft: '.5%', marginRight:'1.5%', marginBottom: '10px', backgroundColor:'#0e1826', color:'#f2f2f2'}}>NEW CANDIDATE +</button>
                    <button className="button button2" onClick={()=> handleCancel()} style={{marginRight: '3%', marginBottom: '10px', backgroundColor:'red', color: '#f2f2f2'}}>CANCEL</button>
            </div>
            }
            {creatingCandidate &&
            <div className="more-buttons-container">
                    <button className="button button2" onClick={()=> handleCancel()} style={{marginLeft: '3%', marginBottom: '10px', backgroundColor:'red', color: '#f2f2f2'}}>CANCEL</button>
                {isValidInput &&
                    <button className="button button3" style={{marginRight: '3%', marginBottom: '10px', backgroundColor:'green'}}>SAVE</button>
                }
                {!isValidInput &&
                    <button className="button button3" style={{marginRight: '3%', marginBottom: '10px', backgroundColor:'gray', cursor:'default'}}>SAVE</button>
                }
            </div>
            }
            {!creatingCandidate && !decidingCandidateSelectMode &&
            <div className="positions-button-container">
                <button className="button button1" onClick={()=> handleAddCandidate()}>Add Candidate +</button>
            </div>
            }
            </div>

            <div className="more-buttons-container">
                <button className="button button2">Add New Position +</button>
                <button className="button button3">View All Meetings (EYE)</button>
            </div>
        </div>
        
    
    )
}

export default MeetingSchedulerPage