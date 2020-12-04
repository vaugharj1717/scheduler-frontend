import authHeader from './util/auth-header.js';

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
    EditMeeting: "EditMeeting",
    DeleteMeeting: "DeleteMeeting",
    SelectCandidacy: "SelectCandidacy",
    LogIn: "LogIn",
    Register: "Register",
    LogOut: "LogOut",

    GetUsers: "GetUsers",
    GetUser: "GetUser",
    DeleteUser: "DeleteUser",
    DeleteLocation: "DeleteLocation",
    DeleteDepartment: "DeleteDepartment",
    CreateUser: "CreateUser",
    CreateLocation: "CreateLocation",
    CreateDepartment: "CreateDepartment",
    ChangeRole: "ChangeRole",

    GetMessages: "GetMessages",
    SendMessage: "SendMessage",
    SetIsViewingMessages: "SetIsViewingMessages",
    SetIsViewingFiles: "SetIsViewingFiles",
    SetIsViewingUser: "SetIsViewingUser",
    SetIsViewingFeedback: "SetIsViewingFeedback",
    GetRecipients: "GetRecipients",
    GetUserFiles: "GetUserFiles",
    DeleteFile: "DeleteFile",
    UploadFile: "UploadFile",

    UpdateUserInfo: "UpdateUserInfo",
    GetUpcomingMeetingsForUser: "GetUpcomingMeetingsForUser",
    GetPastMeetingsForUser: "GetPastMeetingsForUser",
    SetAlert: "SetAlert",
    GetFeedback: "GetFeedback",
    SetSpinner: "SetSpinner",
    SetErrorMessage: "SetErrorMessage",
    SetCandidateAlert: "SetCandidateAlert",
    SelectUser: "SelectUser",
    SetCreatingMeeting: "SetCreatingMeeting",
    SetEditingMeeting: "SetEditingMeeting",
    SetUserToMessage: "SetUserToMessage",
    SetUserPosition: "SetUserPosition",

    SetMap: "SetMap",
});

export const host = 'http://localhost:8444';
//export const host = 'http://167.172.158.78:8444';
async function checkForErrors(response){
    if(response.status >= 200 && response.status < 300){
        return response;
    }
    else{
        let jsonResponse = await response.json();
        if(jsonResponse.message !== undefined && jsonResponse.message !== null){
            throw Error(`${jsonResponse.message}`);
        }
        else{
            throw Error(`There was an error processing your request`);
        }
    } 
}

export function beginLoggingIn(email, password){
    const options = {
        method: "Post",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({email, password}),
    }
    return dispatch => {
        dispatch(setSpinner(true));
        fetch(`${host}/auth/login`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            if(data.accessToken){
                console.log("Logged in successfully");
                localStorage.setItem("user", JSON.stringify(data));
                dispatch(finishLoggingIn(data));
                dispatch(setErrorMessage(""));
            }
        })
        .catch(err => {
            dispatch(setErrorMessage("Login failed."));
        })
        .finally(result => {
            dispatch(setSpinner(false));
        })
    }
}

export function finishLoggingIn(data){
    return{
        type: Action.LogIn,
        payload: data
    }
}

export function beginLoggingOut(){
    return dispatch => {
        localStorage.removeItem("user");
        dispatch(finishLoggingOut());
    }
}

export function finishLoggingOut(){
    return {
        type: Action.LogOut,
        payload: null
    }
}

export function beginRegistering(email, password){
    const options = {
        method: "Post",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({email, password}),
    }
    return dispatch => {
        dispatch(setSpinner(true));
        fetch(`${host}/auth/register`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            console.log("Successful registration");
            dispatch(finishRegistering(data));
        })
        .catch(err => {
            console.log(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishRegistering(data){
    return{
        type: Action.Register,
        payload: data
    }
}

export function beginGettingPositions(){
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        dispatch(setSpinner(true));
        fetch(`${host}/position`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingPositions(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishGettingPositions(data){
    return{
        type: Action.GetPositions,
        payload: data
    }
}

export function beginGettingUpcomingMeetingsForUser(id){
    console.log("here");
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        dispatch(setSpinner(true));
        fetch(`${host}/meeting/${id}/getUpcoming`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            dispatch(finishGettingUpcomingMeetingsForUser(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishGettingUpcomingMeetingsForUser(data){
    return{
        type: Action.GetUpcomingMeetingsForUser,
        payload: data
    }
}

export function beginGettingPastMeetingsForUser(id){
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        dispatch(setSpinner(true));
        fetch(`${host}/meeting/${id}/getPast`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingPastMeetingsForUser(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishGettingPastMeetingsForUser(data){
    return{
        type: Action.GetPastMeetingsForUser,
        payload: data
    }
}

export function beginGettingParticipants(){
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        dispatch(setSpinner(true));
        fetch(`${host}/user/participant`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingParticipants(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishGettingParticipants(data){
    return{
        type: Action.GetParticipants,
        payload: data
    }
}

export function beginGettingSchedule(scheduleId){
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        dispatch(setSpinner(true));
        fetch(`${host}/schedule/${scheduleId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingSchedule(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishGettingSchedule(schedule){
    return{
        type: Action.GetSchedule,
        payload: schedule
    }
}

export function beginGettingCandidates(){
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        dispatch(setSpinner(true));
        fetch(`${host}/user/candidate`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingCandidates(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishGettingCandidates(data){
    return{
        type: Action.GetCandidates,
        payload: data
    }
}

export function beginGettingLocations(){
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        fetch(`${host}/location`, options)
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
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        fetch(`${host}/department`, options)
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
        dispatch(setSpinner(true));
        const options = {
            method: "DELETE",
            headers: authHeader(),
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
        .finally(result => dispatch(setSpinner(false)));
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
        dispatch(setSpinner(true));
        const options = {
            method: "Post",
            headers: {
                ...authHeader(),
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
        .finally(result => dispatch(setSpinner(false)));
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
        dispatch(setSpinner(true));
        const options = {
            method: "POST",
            headers: {
                ...authHeader(),
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
        .finally(result => dispatch(setSpinner(false)));
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
        dispatch(setSpinner(true));
        const options = {
            method: "Post",
            headers: {
                ...authHeader(),
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
        .finally(result => dispatch(setSpinner(false)));
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
        dispatch(setSpinner(true));
        const options = {
            method: "DELETE",
            headers: {
                ...authHeader(),
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
        .finally(result => dispatch(setSpinner(false)));
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
        dispatch(setSpinner(true));
        const options = {
            method: "DELETE",
            headers: {
                ...authHeader(),
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
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishDeletingPosition(positionId){
    return{
        type: Action.DeletePosition,
        payload: positionId
    }
}

export function selectCandidacy(candidacy, position){
    return{
        type: Action.SelectCandidacy,
        payload: {candidacy, position},
    }
}

export function beginCreatingMeeting(scheduleId, locationId, meetingType, startTime, endTime, participations){
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
            method: "Post",
            headers: {
                ...authHeader(),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({locationId, meetingType, startTime, endTime, participations}),
        }
        fetch(`${host}/meeting/${scheduleId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishCreatingMeeting(data))
            dispatch(setCreatingMeeting(false, false));
            dispatch(setErrorMessage(""));
        })
        .catch(err => {
            dispatch(setErrorMessage(err.message));
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function beginEditingMeeting(meetingId, locationId, meetingType, startTime, endTime, participations){
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
            method: "PATCH",
            headers: {
                ...authHeader(),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({locationId, meetingType, startTime, endTime, participations}),
        }
        fetch(`${host}/meeting/${meetingId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishEditMeeting(data))
            dispatch(setCreatingMeeting(false, false));
            dispatch(setErrorMessage(""));
        })
        .catch(err => {
            dispatch(setErrorMessage(err.message));
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishEditMeeting(meeting){
    return{
        type: Action.EditMeeting,
        payload: meeting
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
        dispatch(setSpinner(true));
        const options = {
            method: "DELETE",
            headers: {
                ...authHeader(),
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
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishDeletingMeeting(data){
    return{
        type: Action.DeleteMeeting,
        payload: data
    }
}


export function beginCreatingDepartment(departmentName){
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
            method: "Post",
            headers: {
                ...authHeader(),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({departmentName}),
        }
        fetch(`${host}/department`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishCreatingDepartment(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishCreatingDepartment(data){
    return{
        type: Action.CreateDepartment,
        payload: data
    }
}

export function beginCreatingUser(name, email, role, departmentId){
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
            method: "Post",
            headers: {
                ...authHeader(),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({name, email, role, departmentId}),
        }
        fetch(`${host}/user`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishCreatingUser(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishCreatingUser(data){
    return{
        type: Action.CreateUser,
        payload: data
    }
}

export function beginCreatingLocation(buildingName, roomNumber){
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
            method: "Post",
            headers: {
                ...authHeader(),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({buildingName, roomNumber}),
        }
        fetch(`${host}/location`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishCreatingLocation(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishCreatingLocation(data){
    return{
        type: Action.CreateLocation,
        payload: data
    }
}

export function beginGettingUsers(){
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        fetch(`${host}/user`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingUsers(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishGettingUsers(data){
    return{
        type: Action.GetUsers,
        payload: data
    }
}

export function beginGettingUser(id){
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        dispatch(setSpinner(true));
        fetch(`${host}/user/getUserWithDepart/${id}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingUser(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function beginGettingUserCoords(id){
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        fetch(`${host}/user/getUserWithDepart/${id}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            dispatch(finishGettingUser(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishGettingUser(data){
    return{
        type: Action.GetUser,
        payload: data
    }
}

export function beginDeletingDepartment(departmentId){
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
            method: "DELETE",
            headers: {
                ...authHeader(),
                "Content-Type" : "text/plain"
            },
            body: JSON.stringify({}),
        }
        fetch(`${host}/department/${departmentId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishDeletingDepartment(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)))
    }
}

export function finishDeletingDepartment(data){
    return{
        type: Action.DeleteDepartment,
        payload: data
    }
}

export function beginDeletingLocation(locationId){
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
            method: "DELETE",
            headers: {
                ...authHeader(),
                "Content-Type" : "text/plain"
            },
            body: JSON.stringify({}),
        }
        fetch(`${host}/location/${locationId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishDeletingLocation(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishDeletingLocation(data){
    return{
        type: Action.DeleteLocation,
        payload: data
    }
}

export function beginDeletingUser(userId){
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
            method: "DELETE",
            headers: {
                ...authHeader(),
                "Content-Type" : "text/plain"
            },
            body: JSON.stringify({}),
        }
        fetch(`${host}/user/${userId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishDeletingUser(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishDeletingUser(data){
    return{
        type: Action.DeleteUser,
        payload: data
    }
}

export function beginChangingRole(userId, role){
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
            method: "PATCH",
            headers: {
                ...authHeader(),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({role}),
        }
        fetch(`${host}/user/${userId}/changeRole`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishChangingRole({id: userId, role: data}))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));

    }
}

export function finishChangingRole(data){
    return{
        type: Action.ChangeRole,
        payload: data
    }
}

export function beginUpdatingUserInfo(userId, address, phone, university, bio){
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
            method: "PATCH",
            headers: {
                ...authHeader(),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({address, phone, university, bio}),
        }
        fetch(`${host}/user/${userId}/updateInfo`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishUpdatingUserInfo(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));

    }
}

export function finishUpdatingUserInfo(data){
    return{
        type: Action.UpdateUserInfo,
        payload: data
    }
}

export function beginUpdatingPassword(userId, oldPassword, newPassword, newPassword2){
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
            method: "POST",
            headers: {
                ...authHeader(),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({userId, oldPassword, newPassword, newPassword2}),
        }
        fetch(`${host}/user/changePassword`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            // dispatch(finishUpdatingPassword("Password successfully changed"));
            console.log("in success");
            dispatch(setErrorMessage("Password change successful"));
        })
        .catch(err => {
            console.log(err.message);
            console.log(err.stack);
            dispatch(setErrorMessage(err.message));
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishUpdatingPassword(data){
    return{
        type: Action.UpdatePassword,
        payload: data
    }
}

export function beginGettingMessages(userId, isViewing){
    const options = {
        method: "GET",
        headers: {
            ...authHeader(),
        }
    }
    return dispatch => {
        fetch(`${host}/user/${userId}/getMessages/${isViewing}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingMessages(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishGettingMessages(data){
    return{
        type: Action.GetMessages,
        payload: data
    }
}

export function beginSendingMessage(senderId, receiverId, message){
    const options = {
        method: "POST",
        headers: {
            ...authHeader(),
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({message}),
    }
    return dispatch => {
        fetch(`${host}/user/${senderId}/sendMessage/${receiverId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishSendingMessage(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishSendingMessage(data){
    return{
        type: Action.SendMessage,
        payload: data
    }
}

export function setIsViewingMessages(val){
    return{
        type: Action.SetIsViewingMessages,
        payload: val
    }
}

export function setIsViewingFiles(val, userId){
    console.log("in setIsViewingFiles");
    return{
        type: Action.SetIsViewingFiles,
        payload: {val, userId}
    }
}

export function setIsViewingUser(val, userId){
    return{
        type: Action.SetIsViewingUser,
        payload: {val, userId}
    }
}

export function beginGettingFiles(userId){
    const options = {
        method: "GET",
        headers: {
            ...authHeader(),
        }
    }
    return dispatch => {
        dispatch(setSpinner(true));
        fetch(`${host}/user/${userId}/files`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingUserFiles(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishGettingUserFiles(data){
    return{
        type: Action.GetUserFiles,
        payload: data
    }
}

export function beginDeletingFile(fileId){
    const options = {
        method: "DELETE",
        headers: {
            ...authHeader(),
        }
    }
    return dispatch => {
        dispatch(setSpinner(true));
        fetch(`${host}/user/deleteFile/${fileId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishDeletingFile(fileId))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishDeletingFile(data){
    return{
        type: Action.DeleteFile,
        payload: data,
    }
}


export function beginGettingRecipients(){
    const options = {
        method: "GET",
        headers: {
            ...authHeader(),
        }
    }
    return dispatch => {
        fetch(`${host}/user/getPossibleRecipients`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingRecipients(data))
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishGettingRecipients(data){
    return{
        type: Action.GetRecipients,
        payload: data
    }
}

export function beginUploadingFile(id, formData){
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
            method: "POST",
            headers: authHeader(),
            body: formData,
        }
        fetch(`${host}/user/${id}/uploadFile`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishUploadingFile(data))
        })
        .catch(err => {
        })
        .finally(result => dispatch(setSpinner(false)));

    }
}

export function finishUploadingFile(file){
    return{
        type: Action.UploadFile,
        payload: file
    }
}

export function beginSubmittingFeedback(feedback, participationId){
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
        method: "POST",
        headers: {
            ...authHeader(),
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({feedback})
        };
        fetch(`${host}/participation/setFeedback/${participationId}`, options)
        .then(checkForErrors)
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function beginSettingAlert(val, participationId, which, meeting){
    console.log(participationId);
    return dispatch => {
        dispatch(setSpinner(true));
        const options = {
            method: "PATCH",
            headers: {
                ...authHeader(),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({alert: val, participationId}),
        }
        fetch(`${host}/participation/patchParticipantAlert`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishSettingAlert(val, participationId, which, meeting));
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));
    }
}

export function finishSettingAlert(val, participationId, which, meeting){
    return{
        type: Action.SetAlert,
        payload: {val, participationId, which, meeting}
    }
}

export function setIsViewingFeedback(val, meetingId){
    return{
        type: Action.SetIsViewingFeedback,
        payload: {val, meetingId}
    }
}

export function beginGettingFeedback(meetingId){
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        dispatch(setSpinner(true));
        fetch(`${host}/participation/getAllParticipation/${meetingId}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingFeedback(data))
        })
        .catch(err => {
            console.error(err);
        })
        .finally(result => dispatch(setSpinner(false)));

    }
}

export function finishGettingFeedback(data){
    return{
        type: Action.GetFeedback,
        payload: data
    }
}

export function setSpinner(val){
    return{
        type: Action.SetSpinner,
        payload: val,
    }
}

export function setErrorMessage(msg){
    return{
        type: Action.SetErrorMessage,
        payload: msg,
    }
}

export function setCandidateAlerts(id, val){
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({value: val}),
    }
    return dispatch => {
        dispatch(setSpinner(true));
        fetch(`${host}/user/${id}/setAlerts`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishSettingCandidateAlert(val));
        })
        .catch(err => {
        })
        .finally(result => {
            dispatch(setSpinner(false));
        })
    }
}

export function finishSettingCandidateAlert(val){
    return{
        type: Action.SetCandidateAlert,
        payload: val
    }
}

export function selectUser(user){
    return{
        type: Action.SelectUser,
        payload: user
    }
}

export function setCreatingMeeting(val, editingVal){
    return{
        type: Action.SetCreatingMeeting,
        payload: {creating: val, editing: editingVal}
    }
}


export function setUserToMessage(user){
    return{
        type: Action.SetUserToMessage,
        payload: user,
    }
}

export function beginSettingUserPosition(userId, lat, lng){
    return dispatch => {
        dispatch(setUserPosition(lat, lng));
        const options = {
            method: "PATCH",
            headers: {
                ...authHeader(),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({lat, lng}),
        }
        fetch(`${host}/user/${userId}/updatePosition`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .catch(err => {
            console.error(err);
        })
    }
}

export function setUserPosition(lat, lng){
    return {
        type: Action.SetUserPosition,
        payload: {lat, lng}
    }
}

export function setMap(val, self){
    
        return{
            type: Action.SetMap,
            payload: {val, self}
        }
    
}