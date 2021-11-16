import { Home_VIEW, Notification_VIEW } from "../actionTypes";
import { Dashboard_VIEW } from "../actionTypes";
import { ResearchandReports_VIEW } from "../actionTypes";
import { PrevalenceMap_VIEW } from "../actionTypes";
import { Maps_VIEW } from '../actionTypes';
import { Tools_VIEW } from "../actionTypes";
import { Resources_VIEW } from "../actionTypes";
import { DataBrowser_VIEW } from "../actionTypes";
import { Covasim_VIEW } from "../actionTypes";
import { Blog_VIEW } from "../actionTypes";
import { Contact_Tracing_VIEW } from "../actionTypes";
import { JUXTAPLOT_VIEW } from "../actionTypes";

  const initialState = {
    selectedView: "Home",
    selectedTitle: "Home"
  };
  
  export function changeView(state=initialState,action) {
  
    switch (action.type) {
      case Home_VIEW:
      case Dashboard_VIEW:
      case ResearchandReports_VIEW:
      case PrevalenceMap_VIEW:
      case Maps_VIEW:
      case Tools_VIEW:
      case Resources_VIEW:
      case DataBrowser_VIEW:
      case Covasim_VIEW:
      case Notification_VIEW:
      case Blog_VIEW:
      case Contact_Tracing_VIEW:
      case JUXTAPLOT_VIEW:
          return {...state, selectedView:action.type, selectedTitle: action.title};
      default:
        return state;
    }
  
  }
  