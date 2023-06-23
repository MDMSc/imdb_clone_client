import {legacy_createStore as createStore} from "redux";

const initialState = {
    loggedInUser: null,
    token: null,
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case "LOGIN":
            return{
                ...state,
                token: action.payload
            }
        case "LOGGED_USER":
            return {
                ...state,
                loggedInUser: action.payload
            }
        case "LOGOUT":
            return{
                ...state,
                loggedInUser: null,
                token: null
            }
        default:
            return state;
    }
}

export default createStore(reducer);
