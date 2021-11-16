import { Dashboard_VIEW, PrevalenceMap_VIEW, Maps_VIEW, ResearchandReports_VIEW, Updates_VIEW } from "../actionTypes";
import { Resources_VIEW, DataBrowser_VIEW, Covasim_VIEW, Notification_VIEW, Blog_VIEW, JUXTAPLOT_VIEWS } from "../actionTypes";

export function HomeView() {

  return (dispatch) => {
    dispatch(  {
      type: Home_VIEW,
      title: "Home"
    });
  }
}

export function DashboardView() {
  return (dispatch) => {
    dispatch(  {
      type: Dashboard_VIEW,
      title: "Dashboard"
    });
  }
}

export function ResearchandReportsView() {
  return (dispatch) => {
    dispatch(  {
      type: ResearchandReports_VIEW,
      title: "Research and Reports"
    });
  }
}


export function PrevalenceMapView() {
  return (dispatch) => {
    dispatch({
      type: PrevalenceMap_VIEW,
      title: "Maps"
    });
  }
}


export function MapsView() {
  return (dispatch) => {
    dispatch({
      type: Maps_VIEW,
      title: "Maps"
    });
  }
}


export function ResourcesView() {
  return (dispatch) => {
    dispatch({
      type: Resources_VIEW,
      title: "Resources"
    });
  }
}

export function DataBrowserView() {
  return (dispatch) => {
    dispatch({
      type: DataBrowser_VIEW,
      title: "Data Browser"
    });
  }
}


export function CovasimView() {
  return (dispatch) => {
    dispatch({
      type: Covasim_VIEW,
      title: "Covasim App"
    });
  }
}

export function NotificationView() {
  return (dispatch) => {
    dispatch({
      type: Notification_VIEW,
      title: "Notificaton"
    });
  }
}


export function BlogView() {
  return (dispatch) => {
    dispatch({
      type: Blog_VIEW,
      title: "Blog"
    });
  }
}

export function ContactTracingAppView() {
  return (dispatch) => {
    dispatch({
      type: Contact_Tracing_VIEW,
      title: "Contact Tracing App"
    });
  }
}


export function JuxtaPlotView() {
  return (dispatch) => {
    dispatch({
      type: JUXTAPLOT_VIEW,
      title: "JuxtaPlot"
    });
  }
}
