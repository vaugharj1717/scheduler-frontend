export const Action = Object.freeze({
    GetPositions: "GetPositions",

});

const host = 'http://localhost:8444';
function checkForErrors(response){
    if(response.status >= 200 && response.status < 300){
        return response;
    }
    else{
        throw Error(`${response.status}: ${response.statusText}`)
    } 
}

export function getPositions(){
    return dispatch => {
        fetch(`${host}/position`)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            return {
                type: Action.GetPositions,
                payload: data
            }
        })
        .catch(err => {
            console.error(err);
        })
    }
}