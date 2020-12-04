import { Action } from "./actions";

function meetingSorter(x, y){
    if(x.startTime > y.startTime){
        return 1;
    }
    else return -1;
}

function meetingSorterDesc(x, y){
    if(x.startTime < y.startTime){
        return 1;
    }
    else return -1;
}

const initialState = {
    positions: [],
    candidates: [],
    departments: [],
    locations: [],
    currentSchedule: {},
    currentCandidacy: {},
    currentPosition: {},
    participants: [],
    users: [],
    currentUser: null,
    currentUserLat: 0,
    currentUserLng: 0,
    messages: [],
    isViewingMessages: false,
    isViewingFiles: false,
    userIdOfViewedFiles: null,
    isViewingUser: false,
    isViewingFeedback: false,
    isViewingMap: false,
    isViewingSelfMap: false,
    meetingIdOfFeedback: null,
    userIdOfViewedUser: null,
    viewedUser: {},
    showUnseenMessagesNotifier: false,
    possibleRecipients: [],
    files: [],
    pastMeetings: [],
    upcomingMeetings: [],
    feedback: [],
    isSpinning: false,
    errorMessage: "",
    selectedUser: null,
    isCreatingMeeting: false,
    isEditingMeeting: false,
    userToMessage: null,
};

function reducer(state = initialState, action){
    switch (action.type) {
        case Action.SetMap:

            return{
                ...state,
                isViewingMap: action.payload.val,
                isViewingSelfMap: action.payload.self,
            }
        case Action.SetUserToMessage:
            return{
                ...state,
                userToMessage: action.payload,
            }
        case Action.SetErrorMessage:
            return{
                ...state,
                errorMessage: action.payload
            }
        case Action.SetCreatingMeeting:
            return{
                ...state,
                isCreatingMeeting: action.payload.creating,
                isEditingMeeting: action.payload.editing
            }
        case Action.SetSpinner:
            return{
                ...state,
                isSpinning: action.payload,
                errorMessage: action.payload === true ? "" : state.errorMessage,
            }
        case Action.SetAlert:
            if(action.payload.which === 'upcoming'){
                return{
                    ...state,
                    upcomingMeetings: state.upcomingMeetings.map(meeting => {
                        if(meeting.id === action.payload.meeting.id){
                            return {
                                ...meeting,
                                participations: meeting.participations.map(participation => {
                                    if(participation.id === action.payload.participationId){
                                        return {
                                            ...participation,
                                            alert: action.payload.val
                                        }
                                    } else return participation;
                                })
                            }
                        }
                        else return meeting;
                    })
                }
            } else return{
                ...state,
                    pastMeetings: state.pastMeetings.map(meeting => {
                        if(meeting.id === action.payload.meeting.id){
                            return {
                                ...meeting,
                                participations: meeting.participations.map(participation => {
                                    if(participation.id === action.payload.participationId){
                                        return {
                                            ...participation,
                                            alert: action.payload.val
                                        }
                                    } else return participation;
                                })
                            }
                        }
                        else return meeting;
                    })
            }
        case Action.GetUpcomingMeetingsForUser:
            let sortedMeetings = action.payload.sort(meetingSorter);
            return{
                ...state,
                upcomingMeetings: sortedMeetings
            }
        case Action.GetPastMeetingsForUser:
            let sortedMeetingsDesc = action.payload.sort(meetingSorterDesc);
            return{
                ...state,
                pastMeetings: sortedMeetingsDesc
            }
        case Action.GetFeedback:
            return{
                ...state,
                feedback: action.payload
            }
        
        case Action.GetRecipients:
            return{
                ...state,
                possibleRecipients: action.payload
            }
        case Action.GetUserFiles:
            return{
                ...state,
                files: action.payload
            }
        case Action.DeleteFile:
            return{
                ...state,
                files: state.files.filter(file => file.id !== action.payload)
            }
        case Action.UploadFile:
            return{
                ...state,
                files: [...state.files, action.payload]
            }
        case Action.SetUserPosition:
            return{
                ...state,
                currentUserLat: action.payload.lat,
                currentUserLng: action.payload.lng
            }
        case Action.SetIsViewingMessages:
            return{
                ...state,
                isViewingMessages: action.payload,
                userIdOfViewedFiles: null,
                isViewingFiles: false,
                isViewingUser: false,
                isViewingFeedback: false,
                userIdOfViewedUser: null,
                meetingIdOfFeedback: null,
                errorMessage: "",
            }
        case Action.SetIsViewingFeedback:
            return{
                ...state,
                isViewingFeedback: action.payload.val,
                meetingIdOfFeedback: action.payload.meetingId,
                userIdOfViewedFiles: null,
                isViewingFiles: false,
                isViewingUser: false,
                isViewingMessages: false,
                userIdOfViewedUser: null,
                errorMessage: "",
            }
        case Action.SetIsViewingFiles:
            return{
                ...state,
                isViewingFiles: action.payload.val,
                userIdOfViewedFiles: action.payload.userId,
                isViewingMessages: false,
                isViewingUser: false,
                isViewingFeedback: false,
                userIdOfViewedUser: null,
                meetingIdOfFeedback: null,
                errorMessage: "",
            }
        case Action.UpdateUserInfo:
            return{
                ...state,
                viewedUser: action.payload
            }

        case Action.SetIsViewingUser:
            return{
                ...state,
                isViewingUser: action.payload.val,
                userIdOfViewedUser: action.payload.userId,
                isViewingFiles: false,
                isViewingMessages: false,
                isViewingFeedback: false,
                userIdOfViewedFiles: null,
                meetingIdOfFeedback: null,
            }
        case Action.SetCandidateAlert:
            return{
                ...state,
                viewedUser: {...state.viewedUser, alert: action.payload},
                currentUser: {...state.currentUser, alert: action.payload}

            }
        case Action.GetMessages:
            let showUnseenMessages = false;
            let updatedMessageList = action.payload.map(message => {
                if(state.currentUser !== null && message.sender.id == state.currentUser.id){
                    return {...message, userIsSender: true, displayUnseen: false}
                }
                else if(state.currentUser !== null && message.receiver.id == state.currentUser.id){
                    if(message.seen || state.isViewingMessages){
                        return {...message, userIsSender: false, displayUnseen: false}
                    }
                    else{
                        showUnseenMessages = true;
                        return {...message, userIsSender: false, displayUnseen: true}
                    }
                }
            })
            return{
                ...state,
                messages: updatedMessageList,
                showUnseenMessagesNotifier: showUnseenMessages
            }
        case Action.SendMessage:
            return{
                ...state,
                messages: [{...action.payload, userIsSender: true, displayUnseen: false}, ...state.messages]
            }
        case Action.ChangeRole:
            return{
                ...state,
                users: state.users.map(user => {
                    if (user.id = action.payload.id) return {...user, role: action.payload.role}
                    else return user;
                })
            }
        case Action.GetUsers:
            return{
                ...state,
                users: action.payload
            }
        case Action.GetUser:
            return{
                ...state,
                viewedUser: action.payload
            }
        case Action.CreateUser:
            return{
                ...state,
                users: [...state.users, action.payload]
            }
        case Action.CreateLocation:
            return{
                ...state,
                locations: [...state.locations, action.payload]
            }
        case Action.CreateDepartment:
            return{
                ...state,
                departments: [...state.departments, action.payload]
            }
        case Action.DeleteUser:
            return{
                ...state,
                users: state.users.filter(user => user.id !== action.payload)
            }
        case Action.DeleteLocation:
            return{
                ...state,
                locations: state.locations.filter(location => location.id !== action.payload)
            }
        case Action.DeleteDepartment:
            return{
                ...state,
                departments: state.departments.filter(department => department.id !== action.payload)
            }
            
        case Action.GetPositions:
            return {
                ...state,
                positions: action.payload
            }
        case Action.DeleteCandidacy:
            return {
                ...state,
                positions: state.positions.map(position => {
                    return {...position, candidacies: position.candidacies.filter(candidacy => candidacy.id !== action.payload)}})                
            }
        case Action.SaveCandidate:
            return{
                ...state,
                positions: state.positions.map(position => {
                    if(action.payload.position.id === position.id){
                        return {...position, candidacies: [...position.candidacies, action.payload]}
                    }
                    else return position;
                })
            }
        case Action.AssignCandidateToPosition:
            return{
                ...state,
                positions: state.positions.map(position => {
                    if(action.payload.position.id === position.id){
                        return {...position, candidacies: [...position.candidacies, action.payload]}
                    }
                    else return position;
                })
            }
        case Action.DeleteSchedule:  
            return{
                ...state,
                positions: state.positions.map(position => {
                    return {...position, candidacies: position.candidacies.map(candidacy => {
                        if(candidacy.schedule.id === action.payload) return {...candidacy, schedule: {id: action.payload, meetings:[]}}
                        else return candidacy;
                    })   
                }})
            }
        case Action.DeletePosition:
            return{
                ...state,
                positions: state.positions.filter(position => position.id !== action.payload)
            }
            
        case Action.GetCandidates:
            return{
                ...state,
                candidates: action.payload
            }
        case Action.GetDepartments:
            return{
                ...state,
                departments: action.payload
            }
        case Action.CreatePosition:
            return{
                ...state,
                positions: [...state.positions, {...action.payload, candidacies: []}]
            }
        case Action.SelectCandidacy:
            return{
                ...state,
                currentCandidacy: {...action.payload.candidacy},
                currentPosition: {...action.payload.position}
            }
        case Action.SelectUser:
            return{
                ...state,
                selectedUser: action.payload
            }
        case Action.GetSchedule:
            return{
                ...state,
                currentSchedule: {...action.payload, meetings: action.payload.meetings.sort(meetingSorter), loaded: true}
            }
        case Action.GetLocations:
            return{
                ...state,
                locations: action.payload
            }
        case Action.GetParticipants:
            return{
                ...state,
                participants: action.payload
            }
        case Action.CreateMeeting:
            return{
                ...state,
                currentSchedule: {...state.currentSchedule, meetings: [...state.currentSchedule.meetings, action.payload].sort(meetingSorter)}
            }
        case Action.EditMeeting:
            return{
                ...state,
                currentSchedule: {...state.currentSchedule, meetings: state.currentSchedule.meetings.map(meeting => {
                    if(meeting.id === action.payload.id){
                        return action.payload;
                    }
                    else{
                        return meeting;
                    }
                }).sort(meetingSorter)
                }
            }
        case Action.DeleteMeeting:
            return{
                ...state,
                currentSchedule: {...state.currentSchedule, meetings: state.currentSchedule.meetings.filter(meeting => 
                    meeting.id !== action.payload    
                )}
            }
        case Action.LogIn:
            console.log(action.payload);
            return{
                ...state,
                currentUser: {id: action.payload.id, role: action.payload.role, email: action.payload.email, department: action.payload.department}
            }
        case Action.LogOut:
            return initialState;

        default:
            return {...state}
    }
}

export default reducer;