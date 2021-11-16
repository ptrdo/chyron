
import {
  RECEIVE_ARCGIS_SUMMARY_DATA,
  RECEIVE_ARCGIS_COUNTRY_DATA,
  RECEIVE_ARCGIS_STATE_DATA,
  SET_ARCGIS_ITEM_DATA,
  ADVANCE_ARCGIS_ITEM_DATA } from "../actionTypes";

import { showError } from "./messaging";
import { get } from "lodash";

const receiveStateData = (data) => {
  return {
    type: RECEIVE_ARCGIS_STATE_DATA,
    data: get(data, "features", []).map(item => { return get(item, "attributes", {}); }),
    received: Date.now()
  }
};

const receiveCountryData = (data) => {
  return {
    type: RECEIVE_ARCGIS_COUNTRY_DATA,
    data: get(data, "features", []).map(item => { return get(item, "attributes", {}); }),
    received: Date.now()
  }
};

const receiveSummaryData = (data) => {
  return {
    type: RECEIVE_ARCGIS_SUMMARY_DATA,
    data: get(data, "features", []).map(item => { return Object.assign({ OBJECTID:1,Country_Region:"Global" }, get(item, "attributes", {}))}),
    received: Date.now()
  }
};

const receiveError = (data) => {
  let message = get(data, "error.message", "");
  if (message.length < 1) {
    message = get(data, "error.details", ["Sorry, ArcGIS returned an error."])[0];
  }
  console.log("message",message);
  return message;
};

const endpoint = {
  protocol: "https://",
  domain: "services1.arcgis.com/",
  identifier: "0MSEUqKaxRlEPj5g",
  service: "/arcgis/rest/services/ncov_cases2_v1/FeatureServer/",
  layer: {
    deaths: 0,
    cases: 1,
    country: 2,
    state: 3
  },
  params: { /* f:"json", // hardcoded as "/query?f=json" to avoid "/query?&..." */
    where:["1%3D1","1%3D1","1%3D1","Country_Region%3D%27US%27"], /* ..."%20AND%20Lat<>0" to discount cruise ships (States) */
    returnGeometry:false,
    spatialRel:"esriSpatialRelIntersects",
    outFields:"*",
    orderByFields:[null,null,"Deaths%20DESC","Province_State%20ASC"],
    resultRecordCount:[null,null,10,100],
    outSR: 4326,
    outStatistics:[{
      statisticType:"sum",
      onStatisticField:"Confirmed",
      outStatisticFieldName:"Confirmed"
    },{
      statisticType:"sum",
      onStatisticField:"Deaths",
      outStatisticFieldName:"Deaths"
    },{
      statisticType:"sum",
      onStatisticField:"Active",
      outStatisticFieldName:"Active"
    },{
      statisticType:"avg",
      onStatisticField:"Mortality_Rate",
      outStatisticFieldName:"Mortality_Rate"
    },{
      statisticType:"avg",
      onStatisticField:"Incident_Rate",
      outStatisticFieldName:"Incident_Rate"
    },{
      statisticType:"max",
      onStatisticField:"Last_Update",
      outStatisticFieldName:"Last_Update"
    }],
    cacheHint:true
  },
  /**
   * encoded assembles the endpoint URL per layer, standard params, and overrides.
   * @param layerName {String} is the pre-configured layer available from service (e/g "country").
   * @param paramOverrides {Object} any {property:value} set to apply instead of standard params.
   * @returns {String} the REST-compliant URL
   */
  encoded: function(layerName, paramOverrides) {
    let layerIndex = !!layerName && layerName in this.layer ? this.layer[layerName] : 2; // default: country
    let url = this.protocol
        + this.domain
        + this.identifier
        + this.service
        + (layerIndex < 2 ? 2 : layerIndex) /* layers 0,1 do NOT return Mortality_Rate */
        + "/query?f=json";
    for (let p in this.params) {
      if (p in Object(paramOverrides)) {
         url  += `&${p}=${paramOverrides[p]}`;
      } else {
        switch (p) {
          case "outStatistics":
            if (layerIndex < 2) {
              url += `&outStatistics=${encodeURIComponent(JSON.stringify(this.params.outStatistics))}`;
            }
            break;
          case "where":
          case "resultRecordCount":
          case "orderByFields":
            if (this.params[p][layerIndex]!==null) {
              url += `&${p}=${this.params[p][layerIndex]}`;
            }
            break;
          default:
            if (this.params[p][layerIndex]!==null) {
              url += `&${p}=${this.params[p]}`;
            }
        }
      }
    }
    return url;
  }
}

const exampleFeature = {
  "OBJECTID":1,
  "Province_State":"Alabama",
  "Country_Region":"US",
  "Last_Update":1587072652000,
  "Lat":32.3182,
  "Long_":-86.9023,
  "Confirmed":4345,
  "Deaths":133,
  "Recovered":null,
  "Active":4212,
  "FIPS":"01",
  "Incident_Rate":92.6657164787369,
  "People_Tested":34205,
  "People_Hospitalized":524,
  "Mortality_Rate":3.06098964326812,
  "UID":84000001,
  "ISO3":"USA",
  "Hospitalization_Rate":12.0598388952819,
  "Testing_Rate":729.489259414314
};


export function setItemData(choice) {
  return {
    type: SET_ARCGIS_ITEM_DATA,
    payload: choice,
    received: Date.now()
  }
}

export function advanceItemData(dir= 1) {
  return {
    type: ADVANCE_ARCGIS_ITEM_DATA,
    direction: dir,
    received: Date.now()
  }
}

export function fetchStateData(options) {

  let url = endpoint.encoded("state", {}); // gets US states and territories (alphabetical)

  return (dispatch) => {
    return fetch(url, { method:"GET" })
    .then(response => response.json())
    .then(data => {
      if ("error" in data) {
        dispatch(showError(receiveError(data)));
      } else {
        dispatch(receiveStateData(data));
      }
    })
    .catch(error => {
      console.error("./redux/action/arcGIS/fetchStateData", error);
    })
    .finally(() => {
      // console.log("redux.action.chyron.fetchCountryData:","Done!");
    });
  };
}

export function fetchCountryData(options) {

  let url = endpoint.encoded("country", {}); // gets top 10 countries (by deaths)

  return (dispatch) => {
    return fetch(url, { method:"GET" })
    .then(response => response.json())
    .then(data => {
        if ("error" in data) {
          dispatch(showError(receiveError(data)));
        } else {
          dispatch(receiveCountryData(data));
        }
    })
    .catch(error => {
      console.error("./redux/action/arcGIS/fetchCountryData", error);
    })
    .finally(() => {
      // console.log("redux.action.chyron.fetchCountryData:","Done!");
    });
  };
}

export function fetchSummaryData(options) {

  let url = endpoint.encoded("cases", {}); // gets global summary data

  return (dispatch) => {
    return fetch(url, { method:"GET" })
    .then(response => response.json())
    .then(data => {
      if ("error" in data) {
        dispatch(showError(receiveError(data)));
      } else {
        dispatch(receiveSummaryData(data));
      }
    })
    .catch(error => {
      console.error("./redux/action/arcGIS/fetchSummaryData", error);
    })
    .finally(() => {
      // console.log("redux.action.chyron.fetchSummaryData:","Done!");
    });
  };
}

/**
 * DEPRECATED
 * fetchAllData will GET from one of a variety of endpoints with appropriate parameters.
 * @returns {function(*=): Promise<Response>}
 */
export function fetchAllData() {

  let cache = [];
  let primary = endpoint.encoded("country"); // gets top 10 countries (by deaths)
  let secondary = endpoint.encoded("state"); // gets US states and territories (alphabetical)

  return (dispatch) => {
    fetch(primary, { method:"GET" })
    .then(response => response.json())
    .then(response => cache = response.features.map(item => { item.attributes.OBJECTID += 100; return item; }))
    .then(append => fetch(secondary, { method:"GET" }))
    .then(response => response.json())
    .then(response => cache = cache.concat(response.features))
    .catch(function (error) {
      showError(error);
    })
    .finally(() => {
      dispatch(cache);
    });
  };
}