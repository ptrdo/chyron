
import {content_JSON} from "../actionTypes";
import {handleResponse} from "../../utils/utils";
import {showError} from "./messaging";

function contentReceived(data) {
  return { type: content_JSON, data }
}

export function fetchContent(endpoint) {

  let url = endpoint || "/data/home.json";

  return (dispatch) => {

    return fetch(url, {method:"GET"})
    .then(response => {
      handleResponse(response,
      (items)=>{
        /*success*/
        dispatch(contentReceived(items));
      },
      (data)=> {
        /*failure*/
        dispatch(showError(data));
      })
    })
  };
}

// setFilter(prop,val){}
// setPaging(offset,count){}