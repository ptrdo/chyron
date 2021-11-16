
import React, { useEffect, useState } from "react";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RedoIcon from '@material-ui/icons/Redo';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSummaryData,
  fetchCountryData,
  fetchStateData,
  setItemData,
  advanceItemData } from "../../redux/action/arcGIS";

import { isEmpty, get, find } from "lodash";
import { wait } from "../../utils/utils";

const styles = makeStyles(theme => ({
  root: {},
  paper: {},
  chyron: {
    display:'block',
    width:'inherit',
    margin: 0,
    padding: 0,
    backgroundColor:'gold',
    overflow:'hidden',
    [theme.breakpoints.down('xs')]: {
      zoom: 0.75
    }
  },
  chyronot: {
    display:'none',
    margin: 0,
    padding: 0,
    backgroundColor:'#cc0000',
    overflow:'hidden'
  },
  ticker: {
    padding:'0 2.5rem 0 1rem',
    lineHeight:'44px',
    whiteSpace:'nowrap',
    overflow:'hidden',
    [theme.breakpoints.down('xs')]: {
      padding:'0 2.5rem 0 1rem'
    }
  },
  pager: {
    [theme.breakpoints.down('sm')]: {
      display:'none'
    }
  },
  toggle: {
    position:'absolute',
    width: 24,
    height: 24,
    padding: 0,
    top: 40,
    right:'9rem',
    border:'2px solid transparent',
    borderRadius:'50%',
    background:'#002B3D',
    textAlign:'center',
    color:'#ffffff',
    boxShadow:'0 0 12px rgba(0,0,0,0.5)',
    outline:'none',
    cursor:'pointer',
    [theme.breakpoints.down('xs')]: {
      top: 50,
      right:'8rem'
    },
    '&:hover': {
      borderColor:'#ffffff',
      backgroundColor:'#cc0000'
    },
    '&:active': {
      borderColor:'#ffffff',
      backgroundColor:'#880000'
    }
  },
  expando: {
    display:'inline-block',
    position:'relative',
    float:'right',
    marginTop:-38,
    marginRight: 10,
    lineHeight:1,
    fontSize:'2rem',
    color:'darkgoldenrod',
    border:'none',
    outline:'none',
    cursor:'pointer',
    backgroundColor:'transparent !important',
    '&:hover': {
      color:'#0072a2'
    },
    '&:active': {
      color:'#000000'
    }
  },
  select: {
    minWidth:'2em',
    textIndent:'0.5em',
    color:'mediumvioletred',
    fontSize:'1.3em !important',
    fontFamily: 'Kanit',
    fontWeight: 500,
    verticalAlign:-3
  }
}));

/**
 * Chyron is a full-width messaging band (usually appearing below the header).
 * NOTE: To enable, set enabled=true;
 * @returns {JSX} the view
 * @constructor
 */

export default function Chyron(props) {

  const enabled = true;
  const showByDefault = true;

  const classes = styles();
  const dispatch = useDispatch();
  const chyronItem = useSelector (state => {
    return state.arcGIS.itemData;
  });
  const chyronData = useSelector (state => {
    return state.arcGIS;
  });
  const getCurrentSelection = () => {
    if (isEmpty(chyronItem)) {
      return ["countryData", get(chyronData, "countryData[0].OBJECTID", "18")];
    } else {
      return [
        ("Province_State" in chyronItem)
        ? "stateData"
        : ("ISO3" in chyronItem)
        ? "countryData"
        : "summaryData"
        , chyronItem.OBJECTID
      ];
    }
  };

  const [selectValue, setSelectValue] = useState("countryData_18");

  /**
   * toggle shows/hides the chyron (animated via css).
   * @param event {Event|null}
   * @param force {Integer} -1 (default) toggles, 0 will hide, 1 will show.
   */
  const toggleShow = (event, force = -1) => {
    !!event && event.stopPropagation();
    if (force > 0) {
      document.body.classList.add("chyron");
    } else if (force > -1) {
      document.body.classList.remove("chyron");
    } else {
      document.body.classList.toggle("chyron");
    }
    return true;
  };

  const toggleExpand = (event) => {
    !!event && event.stopPropagation();
    if (!!event && !!event.target.closest("DL")) {
      // suppress when manual selection of content
      return false;
    }
    !!event.target.closest("figure") && event.target.closest("figure").classList.toggle("tabled");
    return true;
  };

  /**
   * template {Object} is mapping for statistical data => rendered display (including sequence).
   * @property name {String} is what will render to screen.
   * @property field {String} is the expected data field name.
   * @property value {Undetermined} is a placeholder for mapped data.
   * @property unit {String} renders qualifying text.
   * @property className {String} optional CSS class for styling.
   * @property transform {Function} converts expected data to human legible.
   *
   * NOTE: when "unit" is null, that data point WILL NOT RENDER.
   * NOTE: when "unit" is "%", that text will be calculated in distill();
   */
  const template = [
    {
      name: "Error",
      field: "error",
      value: "",
      unit: null,
      className: "",
      transform: (input) => {
        return input.toString();
      }
    }, {
      name: "Deaths",
      field: "Deaths",
      value: "",
      unit: "%",
      className: "",
      transform: (input) => {
        return /^\d+$/.test(input) ? (input).toLocaleString() : "";
      }
    }, {
      name: "Active",
      field: "Active",
      value: "",
      unit: "%",
      className: "",
      transform: (input) => {
        return /^\d+$/.test(input) ? (input).toLocaleString() : "";
      }
    }, {
      name: "Confirmed",
      field: "Confirmed",
      value: "",
      unit: "%",
      className: "",
      transform: (input) => {
        return /^\d+$/.test(input) ? (input).toLocaleString() : "";
      }
    }, {
      name: "Case Fatality Rate",
      field: "Mortality_Rate",
      value: "",
      unit: "% deaths per cases",
      className: "tabled",
      transform: (input) => {
        return /^\d+\.?\d*$/.test(input) ? (input).toPrecision(4) : "";
      }
    }, {
      name: "Incident Rate",
      field: "Incident_Rate",
      value: "",
      unit: "cases per 100,000",
      className: "tabled",
      transform: (input) => {
        return /^\d+\.?\d*$/.test(input) ? (input).toPrecision(5) : "";
      }
    }
  ];

  const dateLegible = (input) => {
    let date = new Date(/^\d+$/.test(input)?Number(input):Date.now());
    let hours = (date.getHours() % 12) || 12;
    let meridiem = date.getHours() >= 12 ? "PM" : "AM";
    let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()];
    let formatted = `${month} ${date.getDate()}, ${hours}:${date.getUTCMinutes()}${meridiem} Local`;
    return formatted;
  };

  const calculatePercentOfSummary = (field, value) => {

    let scope, summary, percentage, answer = "";
    if ("Province_State" in chyronItem) {
      scope = "United States";
      summary = find(chyronData.countryData, { Country_Region: "US" });
    } else {
      scope = "Global";
      summary = get(chyronData, "summaryData")[0];
    }
    if (!!summary && field in summary) {
      if (/^\d+$/.test(value) && Number(value) !== 0 && /^\d+$/.test(summary[field])) {
        percentage = (parseInt(value)/parseInt(summary[field])) * 100;
        answer = `${percentage<1?percentage.toFixed(2):percentage.toFixed(1)}% of ${scope}`
      }
    }
    return answer;
  };

  const distill = () => {

    let result = [];
    template.forEach((item,index) => {
       if (item.field in chyronItem) {
         result.push([
           item.name,
           item.transform(chyronItem[item.field]),
           item.unit==="%"?calculatePercentOfSummary(item.field,chyronItem[item.field]):item.unit,
           item.className
         ]);
       }
    });
    if (result.length > 0) {
      result.push([
          "Source",
          "ArcGIS",
          "John Hopkins University",
          "tabled",
          "https://disasterresponse.maps.arcgis.com/home/user.html?user=CSSE_GISandData"
      ]);
      result.push([
          "Updated",
          dateLegible(chyronItem["Last_Update"]),
          (new Date(chyronItem["Last_Update"])).toISOString(),
          "date"
      ]);
    }
    return result;
  };

  const handleChange = (event) => {
    event.stopPropagation();
    let values = event.target.value.split("_");
    setSelectValue(event.target.value);
    dispatch(setItemData({ layer:values[0], id:values[1] }));
  };

  const handlePaging = (event) => {
    !!event && event.stopPropagation();
    dispatch(advanceItemData(!!event.target.closest("svg").previousSibling ? 1 : -1));
  };

  const getData = () => {

    // @TODO: show loading meter in chyron

    dispatch(fetchSummaryData({}));
    dispatch(fetchCountryData({}));
    dispatch(fetchStateData({}));
  }

  useEffect(() => {

    if (enabled) {
      getData();
      if (props.closedByDefault) {
        toggleShow(null, 0);
      } else if (/map/i.test(props.previousView)) {
        toggleShow(null, 1);
      }
    }

  },[]);

  useEffect(()=> {
    if (!isEmpty(chyronItem)) {
      if (selectValue != getCurrentSelection().join("_")) {
        setSelectValue(getCurrentSelection().join("_"));
      }
    }
  }, [chyronItem]);

  useSelector(state => {

    // @TODO: hide loading meter in chyron

    if (!isEmpty(state.arcGIS.countryData) && isEmpty(state.arcGIS.itemData)) {
      state.arcGIS.itemData = Object.assign({}, state.arcGIS.countryData[0]);
      wait(200).then(() => {
        setSelectValue(getCurrentSelection().join("_"));
        if (props.closedByDefault) {
          toggleShow(null, 0);
        } else {
          toggleShow(null, showByDefault ? 1 : 0);
        }
      });
    }
  });

  return (
    <figure className={enabled?classes.chyron:classes.chyronot} onClick={toggleExpand}>
      <figcaption className={classes.ticker}>
        <ins className={classes.pager} title={"show previous or next"} onClick={handlePaging}>
          <RedoIcon />
          <RedoIcon />
        </ins>
        <Select
          className={classes.select}
          disableUnderline={true}
          value={selectValue}
          key={selectValue}
          onChange={handleChange}
          itemType={"chyronSelect"}>
          {
            chyronData.summaryData.map((item, i) => (
              <MenuItem
                className={"chyronItem"}
                value={`summaryData_${item.OBJECTID}`}
                key={`summaryData_${item.OBJECTID}`}>
                {item.Country_Region}<samp>{(item.Deaths).toLocaleString()}</samp>
              </MenuItem>
            ))
          }{
            chyronData.countryData.map((item, i) => (
              <MenuItem
                className={"chyronItem"}
                value={`countryData_${item.OBJECTID}`}
                key={`countryData_${item.OBJECTID}`}>
                {item.Country_Region}<samp>{(item.Deaths).toLocaleString()}</samp>
              </MenuItem>
            ))
          }{
            chyronData.stateData.map((item, i) => (
              <MenuItem
                className={"chyronItem"}
                value={`stateData_${item.OBJECTID}`}
                key={`stateData_${item.OBJECTID}`}>
                {item.Province_State}
              </MenuItem>
            ))
          }
        </Select>
        {
          distill().map((item,i) => {
            if (!!item[4]) {
              return (
                <dl key={i} itemProp={item[0]} className={item[3]}>
                  <dt>{item[0]}</dt>
                  <dd>{item[1]}</dd>
                  <dd className={"unit"}>
                    <a href={item[4]} target={"_blank"} title={"learn about source"}>{item[2]}</a>
                  </dd>
                </dl>
              )
            } else {
              return (
                <dl key={i} itemProp={item[0]} className={item[3]}>
                  <dt>{item[0]}</dt>
                  <dd>{item[1]}</dd>
                  <dd className={"unit"}>{item[2]}</dd>
                </dl>
              )
            }
          })
        }
      </figcaption>
      <button className={classes.toggle} title={"show/hide"} onClick={toggleShow}><b>.ıl</b></button>
      <button className={classes.expando} title={"more/less"} onClick={toggleExpand}><ExpandMoreIcon /></button>
    </figure>
  )
}