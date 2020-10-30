import { Action } from "./actions";

function meetingSorter(x, y){
    if(x.startTime > y.startTime){
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
    participants: [],
    users: [],
    currentUser: null,
    messages: [],
    isViewingMessages: false,
    showUnseenMessagesNotifier: false,
    possibleRecipients: []
};

function reducer(state = initialState, action){
    switch (action.type) {
        case Action.GetRecipients:
            return{
                ...state,
                possibleRecipients: action.payload
            }
        case Action.SetIsViewingMessages:
            return{
                ...state,
                isViewingMessages: action.payload
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
                currentCandidacy: {...action.payload}
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
                currentUser: {id: action.payload.id, role: action.payload.role, email: action.payload.email}
            }
        case Action.LogOut:
            return initialState;

        default:
            return {...state}
    }
}

export default reducer;