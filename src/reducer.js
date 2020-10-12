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
};

function reducer(state = initialState, action){
    switch (action.type) {
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

        default:
            return {...state}
    }
}

export default reducer;