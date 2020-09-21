import React, {useState} from 'react';
import './Meeting-Scheduler-Page.css';
import ExampleComponent from './components/Example-Component.js'

function MeetingSchedulerPage() {
    //useState: let [trackedValue, setterFuncForTrackedValue] = useState(initialValue)
    let [creatingCandidate, setCreatingCandidate] = useState(false);
    
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
            <div class="positions-panel">
                <div class="positions-label">
                    <span class="b">Assistant Professor</span> for the <span class="b">CS</span> Department (124434345)
                </div>
                <div class="scrollbox">
                    <table class="positions-table">
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
                            <td style={{padding:'0px',borderWidth:'0px'}}><textarea id="w3review" name="w3review" style={{width: '98%', resize: 'none'}}></textarea></td>
                            <td style={{padding:'0px',borderWidth:'0px'}}><textarea id="w3review" name="w3review" style={{width: '98%', resize: 'none'}}></textarea></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        }
                    </table>
                </div>
            
            {creatingCandidate &&
            <div class="more-buttons-container">
                <button class="button button2" onClick={()=>setCreatingCandidate(false)} style={{marginLeft: '3%', marginBottom: '10px', backgroundColor:'red', color: '#f2f2f2'}}>CANCEL</button>
                
                <button class="button button3" style={{marginRight: '3%', marginBottom: '10px', backgroundColor:'#319838'}}>SAVE</button>
            </div>
            }
            {!creatingCandidate &&
            <div class="positions-button-container">
                <button class="button button1" onClick={()=>setCreatingCandidate(true)}>Add New Candidate +</button>
            </div>
            }
            </div>

            <div class="more-buttons-container">
                <button class="button button2">Add New Position +</button>
                <button class="button button3">View All Meetings (EYE)</button>
            </div>
        </div>
        
    
    )
}

export default MeetingSchedulerPage