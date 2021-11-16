import {SET_BLOG_INDEX} from "../actionTypes";


export function blog(state={index:0}, action) {

    switch (action.type) {
        case SET_BLOG_INDEX:
            return { ...state, index:action.index}
        default:
            return state;        
    }

}