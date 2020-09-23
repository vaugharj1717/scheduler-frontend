import { Action } from "./actions";

const initialState = {
    positions: []       // {positions}
};

function reducer(state = initialState, action){
    switch (action.type) {
        case Action.GetPositions:
            return {
                ...state,
                positions: action.payload
            }

        default:
            return {...state}
    }
}

export default reducer;