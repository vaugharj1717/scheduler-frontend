export const Action = Object.freeze({
    GetPositions: "GetPositions",
    DeleteCandidacy: "DeleteCandidacy",
    DeleteSchedule: "DeleteSchedule",
    SaveCandidate: "SaveCandidate",
    GetCandidates: "GetCandidates",
    AssignCandidateToPosition: "AssignCandidateToPosition",
    GetDepartments: "GetDepartments",
    CreatePosition: "CreatePosition",
    DeletePosition: "DeletePosition",
    GetSchedule: "GetSchedule",
    GetLocations: "GetLocations",
    GetParticipants: "GetParticipants",
    CreateMeeting: "CreateMeeting",
    DeleteMeeting: "DeleteMeeting",
    SelectCandidacy: "SelectCandidacy"
});

const host = 'http://localhost:8444';
function checkForErrors(response){
    console.log('success');
    if(response.status >= 200 && response.status < 300){
        return response;
    }
    else{
        console.log('error');
        throw Error(`${response.status}: ${response.statusText}`)
    } 
}

export function beginGettingPositions(){
    return dispatch => {
        fetch(`${host}/position`)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingPositions(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishGettingPositions(data){
    return{
        type: Action.GetPositions,
        payload: data
    }
}

export function beginGettingParticipants(){
    return dispatch => {
        fetch(`${host}/user/participant`)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingParticipants(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishGettingParticipants(data){
    return{
        type: Action.GetParticipants,
        payload: data
    }
}

export function beginGettingSchedule(scheduleId){
    return dispatch => {
        fetch(`${host}/schedule/${scheduleId}`)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingSchedule(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishGettingSchedule(schedule){
    return{
        type: Action.GetSchedule,
        payload: schedule
    }
}

export function beginGettingCandidates(){
    return dispatch => {
        fetch(`${host}/user/candidate`)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingCandidates(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishGettingCandidates(data){
    return{
        type: Action.GetCandidates,
        payload: data
    }
}

export function beginGettingLocations(){
    return dispatch => {
        fetch(`${host}/location`)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingLocations(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishGettingLocations(data){
    return{
        type: Action.GetLocations,
        payload: data
    }
}

export function beginGettingDepartments(){
    return dispatch => {
        fetch(`${host}/department`)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingDepartments(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishGettingDepartments(data){
    return{
        type: Action.GetDepartments,
        payload: data
    }
}

export function beginDeletingCandidacy(candidacyId){
    return dispatch => {
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type" : "text/plain"
            },
            body: JSON.stringify({}),
        }
        fetch(`${host}/position/candidacy/${candidacyId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishDeletingCandidacy(candidacyId))
        })
        .catch(err => {
            console.error(err);
            console.log("error");
            console.error(err);
        })
    }
}

export function finishDeletingCandidacy(candidacyId){
    return{
        type: Action.DeleteCandidacy,
        payload: candidacyId
    }
}

export function beginSavingCandidate(positionId, name, email){
    return dispatch => {
        const options = {
            method: "Post",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({name, email}),
        }
        fetch(`${host}/user/candidate/${positionId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            dispatch(finishSavingCandidate(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishSavingCandidate(candidacy){
    return{
        type: Action.SaveCandidate,
        payload: candidacy
    }
}

export function beginCreatingPosition(positionName, departmentId){
    return dispatch => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({}),
        }
        fetch(`${host}/position/createPosition/${positionName}/${departmentId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            dispatch(finishCreatingPosition(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishCreatingPosition(position){
    return{
        type: Action.CreatePosition,
        payload: position
    }
}

export function beginAssigningCandidateToPosition(positionId, candidateId){
    return dispatch => {
        const options = {
            method: "Post",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({}),
        }
        fetch(`${host}/position/${positionId}/candidate/${candidateId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(candidacy => {
            dispatch(finishAssigningCandidateToPosition(candidacy))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishAssigningCandidateToPosition(candidacy){
    return{
        type: Action.AssignCandidateToPosition,
        payload: candidacy
    }
}

export function beginDeletingSchedule(scheduleId){
    return dispatch => {
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type" : "text/plain"
            },
            body: JSON.stringify({}),
        }
        fetch(`${host}/schedule/deleteAllMeeting/${scheduleId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishDeletingSchedule(scheduleId))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishDeletingSchedule(scheduleId){
    return{
        type: Action.DeleteSchedule,
        payload: scheduleId
    }
}

export function beginDeletingPosition(positionId){
    return dispatch => {
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type" : "text/plain"
            },
            body: JSON.stringify({}),
        }
        fetch(`${host}/position/${positionId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishDeletingPosition(positionId))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishDeletingPosition(positionId){
    return{
        type: Action.DeletePosition,
        payload: positionId
    }
}

export function selectCandidacy(candidacy){
    return{
        type: Action.SelectCandidacy,
        payload: candidacy,
    }
}

export function beginCreatingMeeting(scheduleId, locationId, meetingType, startTime, endTime, participations){
    console.log(meetingType);
    return dispatch => {
        const options = {
            method: "Post",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({locationId, meetingType, startTime, endTime, participations}),
        }
        fetch(`${host}/meeting/${scheduleId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            dispatch(finishCreatingMeeting(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishCreatingMeeting(meeting){
    return{
        type: Action.CreateMeeting,
        payload: meeting
    }
}

export function beginDeletingMeeting(meetingId){
    return dispatch => {
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type" : "text/plain"
            },
            body: JSON.stringify({}),
        }
        fetch(`${host}/meeting/${meetingId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishDeletingMeeting(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishDeletingMeeting(data){
    return{
        type: Action.DeleteMeeting,
        payload: data
    }
}