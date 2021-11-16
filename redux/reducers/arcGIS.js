
import {
    RECEIVE_ARCGIS_SUMMARY_DATA,
    RECEIVE_ARCGIS_COUNTRY_DATA,
    RECEIVE_ARCGIS_STATE_DATA,
    SET_ARCGIS_ITEM_DATA,
    ADVANCE_ARCGIS_ITEM_DATA } from "../actionTypes";

import { get,has } from "lodash";

export function arcGIS(state= {summaryData:[],countryData:[],stateData:[],itemData:{}}, action) {
    
    const findItem = (info) => {

        let found;
        if ("payload" in info && "layer" in info.payload && "id" in info.payload) {
            found = state[info.payload.layer].filter(item => item.OBJECTID == info.payload.id )[0];
        }
        return found || {};
    };

    const findNextItem = (info) => {

        let direction = get(info, "direction", 1);
        let currentId = get(state, "itemData.OBJECTID", 18);
        let currentIndex = -1;
        let currentLayer = has(state, "itemData.Province_State") ? "stateData" : has(state, "itemData.ISO3") ? "countryData" : "summaryData";
        let currentLayers = ["summaryData","countryData","stateData"];
        switch (currentLayer) {
            case "summaryData":
                currentLayers = direction > 0 ? ["summaryData","countryData","stateData"] : ["summaryData","stateData","countryData"];
                break;
            case "countryData":
                currentLayers = direction > 0 ? ["countryData","stateData","summaryData"] : ["countryData","summaryData","stateData"];
                break;
            case "stateData":
                currentLayers = direction > 0 ? ["stateData","summaryData","countryData"] : ["stateData","countryData","stateData"];
                break;
        }
        currentLayers.some(layer => {
            state[layer].some((item, i) => {
                if (item.OBJECTID == currentId) {
                    currentIndex = i;
                    currentLayer = layer;
                }
                return currentIndex > -1;
            })
            return currentIndex > -1;
        })
        if (currentIndex > -1) {
            if (currentIndex + direction < 0) {
                currentLayer = currentLayers.filter(layer => layer != currentLayer)[0];
                currentId = state[currentLayer][state[currentLayer].length-1].OBJECTID;
            } else if (currentIndex + direction < state[currentLayer].length) {
                currentId = state[currentLayer][currentIndex+direction].OBJECTID;
            } else {
                currentLayer = currentLayers.filter(layer => layer != currentLayer)[0];
                currentId = state[currentLayer][0].OBJECTID;
            }
            return findItem({ payload:{ layer: currentLayer, id: currentId }});
        }
        return {};
    };

    switch (action.type) {

        case RECEIVE_ARCGIS_SUMMARY_DATA:
            return {...state, summaryData: action.data }

        case RECEIVE_ARCGIS_COUNTRY_DATA:
            return {...state, countryData: action.data }

        case RECEIVE_ARCGIS_STATE_DATA:
            return {...state, stateData: action.data }

        case SET_ARCGIS_ITEM_DATA:
            return {...state, itemData: Object.assign({}, findItem(action)) }

        case ADVANCE_ARCGIS_ITEM_DATA:
            return {...state, itemData: Object.assign({}, findNextItem(action)) }

        default:
            return state;
    }
}
