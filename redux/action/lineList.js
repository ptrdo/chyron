

import {handleResponse} from "../../utils/utils";
import {RECEIVE_LINE_LIST_DATA, 
    RECEIVE_LINE_LIST_ALL_DATA,
    RECEIVE_FIELDS,
    RECEIVE_LINE_LIST_FILTER_OPTION,
    RECEIVE_METADATA} from "../actionTypes";
import {showError} from "./messaging";


export function receiveLineListData(data) {
    return {
        type: RECEIVE_LINE_LIST_DATA,
        data: data,
        updated: Date.now()
    }
}

export function receiveLineListAll(data) {
  return {
      type: RECEIVE_LINE_LIST_ALL_DATA,
      data: data,
      updated: Date.now()
  }
}

export function receiveFilterOption(filtername, data) {
  return {
    type: RECEIVE_LINE_LIST_FILTER_OPTION,
    filtername: filtername,
    data: data.filters,
    updated: Date.now()
  }
}


export function receiveFields(source, data) {
  
  return {
    type: RECEIVE_FIELDS,
    source: source,
    fields: data.filters
  }
}

export function receiveMetadata( data) {
  
  return {
    type: RECEIVE_METADATA,
    data: data
  }
}

export function fetchLineList(source, page,pageSize, filters ) {

    let url = `/idmapi/casedata/${source}?page=${page}&size=${pageSize}`;  //todo

    return (dispatch) => {

        return fetch(url, {method:"POST", 
                          body:filters, 
                          headers: {"Content-Type" : "application/json"}})
        .then(response => {
          handleResponse(response,
          (items)=>{
            /*success*/
            dispatch(receiveLineListData(items));
          },
          (data)=> {
            /*failure*/
            dispatch(showError(data));
          })
        })
    };
}

export function fetchAll(source, filters) {

  let url = `/idmapi/casedata/${source}`;  //todo

  return (dispatch) => {

    return fetch(url, {method:"POST", 
      body:filters, 
      headers: {"Content-Type" : "application/json"}})
      .then(response => {
        handleResponse(response,
        (items)=>{
          /*success*/
          dispatch(receiveLineListAll(items));
        },
        (data)=> {
          /*failure*/
          dispatch(showError(data));
        })
      })
  };
}

export function fetchFieldOption(source, filtername) {


  let url = `/idmapi/filter/${source}/filter`;  //todo

  return (dispatch) => {

    return fetch(url, {method:"POST",
      body: `{"col":"${filtername}"}`,
      headers: {"Content-Type" : "application/json"}})
      .then(response => {
        handleResponse(response,
        (items)=>{
          /*success*/
          dispatch(receiveFilterOption(filtername, items));
        },
        (data)=> {
          /*failure*/
          dispatch(showError(data));
        })
      })
  };


}


export function fetchFields(sourceName) {


  let url = `/idmapi/filter/${sourceName}`;  //todo

  return (dispatch) => {

    return fetch(url, {method:"GET"})
      .then(response => {
        handleResponse(response,
        (items)=>{
          /*success*/
          dispatch(receiveFields(sourceName,items));
        },
        (data)=> {
          /*failure*/
          dispatch(showError(data));
        })
      })
  };

}



export function fetchMeta() {


  let url = `/idmapi/metadata`;  //todo

  return (dispatch) => {

    return fetch(url, {method:"GET"})
      .then(response => {
        handleResponse(response,
        (items)=>{
          /*success*/
          dispatch(receiveMetadata(items));
        },
        (data)=> {
          /*failure*/
          dispatch(showError(data));
        })
      })
  };

}