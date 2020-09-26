import { Action } from "./actions";

const initialState = {
    positions: [],
    candidates: [],
    departments: []
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
                        if(candidacy.schedule.id === action.payload) return {...candidacy, schedule: null}
                        else return candidacy;
                    })   
                }})
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

        default:
            return {...state}
    }
}

export default reducer;