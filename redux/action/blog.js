import {SET_BLOG_INDEX} from "../actionTypes";

export function selectBlog(index) {

    return (dispatch) => {

        dispatch( {
            type:SET_BLOG_INDEX,
            index:index
        });

    }
}