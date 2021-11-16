import { combineReducers } from "redux";

import {changeView} from "./view";
import {showMsg} from "./messaging";
import {lineList} from "./lineList";
import {arcGIS} from "./arcGIS";
import {blog} from "./blog"; 

export default combineReducers({changeView, showMsg, lineList, arcGIS, blog});
