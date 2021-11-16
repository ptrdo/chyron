
import {RECEIVE_LINE_LIST_DATA, 
        RECEIVE_LINE_LIST_ALL_DATA,
        RECEIVE_LINE_LIST_FILTER_OPTION,
        RECEIVE_FIELDS,
        RECEIVE_METADATA} from "../actionTypes";

import * as _ from "lodash";
import { DialogActions } from "@material-ui/core";

export function lineList(state={data:[],filterOptions:{},allData:[], fields:[], fieldObjects:[] }, action) {
    
    const orderColumnsByDate = (columns)=> {
        let hasDateColumns = false;
        let dateColumns = [];
        let nonDateColumns = [];
        columns.forEach(col=> {

            if (!isNaN(Date.parse(col))) {
                hasDateColumns = true;
                dateColumns.push({name:col, date:Date.parse(col)});
            } else {
                nonDateColumns.push({name:col})
            }
        });
        if (hasDateColumns) {
            dateColumns = _.sortBy(dateColumns, ['date']).reverse();
            let newColumns = [];
            nonDateColumns.forEach(i=>{newColumns.push(i.name)});
            dateColumns.forEach(i=>{newColumns.push(i.name)});
            return newColumns;
        } else {
            return columns
        }
    }

    switch (action.type) {
        case RECEIVE_LINE_LIST_DATA:
            return {...state, data: action.data, updated:action.updated}
        case RECEIVE_LINE_LIST_ALL_DATA:
            return {...state, allData: action.data}

        case RECEIVE_LINE_LIST_FILTER_OPTION:
            state.filterOptions[action.filtername] = action.data.sort();
            return {...state, updated:action.updated }
        case RECEIVE_FIELDS:
            
            let source = _.find(state.metadata.dataSource, {name:action.source});
            if (source && source.tableLabels && source.tableLabels.length ===0 ) {
                
                source.tableLabels = orderColumnsByDate(action.fields);

            }
            let fieldObjects = [];
            //action.fields.forEach(field => {
            source.tableLabels.forEach(field=> {
                fieldObjects.push({name:field, checked:true});
            });

            return {...state, 
                    //fields: _.orderBy(action.fields, [field=>field.toString().toLowerCase()]), 
                    fields: source.tableLabels,
                    fieldObjects: fieldObjects,
                    // _.orderBy(fieldObjects, 
                    // [field=>  field.name.toString().toLowerCase() ]), 
                    source: action.source};
        case RECEIVE_METADATA:
            
            return {...state, metadata:action.data};
        default:
            return state;
    }
}
