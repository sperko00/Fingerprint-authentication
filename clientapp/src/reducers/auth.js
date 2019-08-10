import {AUTH_SIGN_UP, AUTH_SIGN_OUT,AUTH_ERROR, AUTH_SIGN_IN, AUTH_LOGIN} from '../actions/types';
const DEFAULT_STATE = {
    isAuthenticated : false,
    token : '',
    errorMessage : '',
    email : '',
};

export default ( state = DEFAULT_STATE, action ) => {

    switch(action.type){
        case AUTH_SIGN_UP : 
            return { ...state, email : '',data_url : action.payload, isAuthenticated : false, errorMessage : '' }
        case AUTH_SIGN_IN : 
            return { ...state, email: action.payload, token : '',isAuthenticated : false, errorMessage : '' }
        case AUTH_LOGIN:
            return { ...state, token : action.payload, isAuthenticated : true, errorMessage : '' }
        case AUTH_SIGN_OUT :
            return { ...state, email : '', token : '',isAuthenticated : false, errorMessage : '' }
        case AUTH_ERROR :
            return { ...state, email : '', errorMessage : action.payload }
        default:
            return state;
    }
}