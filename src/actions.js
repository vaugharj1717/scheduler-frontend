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
    GetRecipients: "GetRecipients",
    GetUserFiles: "GetUserFiles",
    DeleteFile: "DeleteFile",
    UploadFile: "UploadFile",

    UpdateUserInfo: "UpdateUserInfo",
    GetUpcomingMeetingsForUser: "GetUpcomingMeetingsForUser",
    GetPastMeetingsForUser: "GetPastMeetingsForUser",
});

export const host = 'http://localhost:8444';
//export const host = 'http://167.172.158.78:8444';
function checkForErrors(response){
    if(response.status >= 200 && response.status < 300){
        return response;
    }
    else{
        console.log('error');
        throw Error(`${response.status}: ${response.statusText}`)
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
        fetch(`${host}/auth/login`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            if(data.accessToken){
                console.log("Logged in successfully");
                localStorage.setItem("user", JSON.stringify(data));
                dispatch(finishLoggingIn(data));
            }
        })
        .catch(err => {
            console.log("Log in failure");
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
        fetch(`${host}/position`, options)
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

export function beginGettingUpcomingMeetingsForUser(id){
    console.log("here");
    const options = {
        headers: authHeader()
    };
    return dispatch => {
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
        fetch(`${host}/meeting/${id}/getPast`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingPastMeetingsForUser(data))
        })
        .catch(err => {
            console.error(err);
        })
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
        fetch(`${host}/user/participant`, options)
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
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        fetch(`${host}/schedule/${scheduleId}`, options)
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
    const options = {
        headers: authHeader()
    };
    return dispatch => {
        fetch(`${host}/user/candidate`, options)
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
                ...authHeader(),
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
    }
}

export function finishCreatingDepartment(data){
    return{
        type: Action.CreateDepartment,
        payload: data
    }
}

export function beginCreatingUser(name, email, role){
    console.log(`NAME: ${name}, EMAIL: ${email}, ROLE: ${role}`);
    return dispatch => {
        const options = {
            method: "Post",
            headers: {
                ...authHeader(),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({name, email, role}),
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
        fetch(`${host}/${id}/user`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
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
    }
}

export function finishChangingRole(data){
    return{
        type: Action.ChangeRole,
        payload: data
    }
}

export function beginUpdatingUserInfo(userId, address, phone, university, bio){
    console.log("here1");
    return dispatch => {
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
    }
}

export function finishUpdatingUserInfo(data){
    return{
        type: Action.UpdateUserInfo,
        payload: data
    }
}

export function beginUpdatingPassword(userId, oldPassword, newPassword, newPassword2){
    console.log("here1");
    return dispatch => {
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
            dispatch(finishUpdatingPassword("Password successfully changed"));
        })
        .catch(err => {
            console.error(err);
        })
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
        fetch(`${host}/user/${userId}/files`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishGettingUserFiles(data))
        })
        .catch(err => {
            console.error(err);
        })
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
        fetch(`${host}/user/deleteFile/${fileId}`, options)
        .then(checkForErrors)
            .then(response => response.json())
            .then(data => {
                dispatch(finishDeletingFile(fileId))
            })
            .catch(err => {
                console.error(err);
            })
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
        fetch(`${host}/user/getCandidatesAndParticipants`, options)
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
    }
}

export function finishUploadingFile(file){
    return{
        type: Action.UploadFile,
        payload: file
    }
}