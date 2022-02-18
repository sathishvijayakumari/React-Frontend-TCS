import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import Navbar from "./components/navbar/Navbar";
import Alerts from "./components/pages/Alerts";
import Assets from "./components/pages/Assets";
import Configuration from "./components/pages/Configuration";
import EmployeeRegistration from "./components/pages/EmployeeRegistraion";
import Home from "./components/pages/Home";
import Reports from "./components/pages/Reports";
import SystemHealth from "./components/pages/SystemHealth";
import Temperature from "./components/pages/Temperature";
import Tracking from "./components/pages/Tracking";
import UploadMap from "./components/pages/UploadMap";
import ZoneConfig from "./components/pages/ZoneConfig";

class App extends Component {
  // Defining the states for the component
  constructor() {
    super();
    this.state = {
      isLoggedIn: parseInt(0),
    };
  }

  /** Method to change state */
  handleUserLogin = (credentials) => {
    this.setState({ isLoggedIn: parseInt(credentials) });
  };

  /** Redern the html content on the browser */
  render() {
    // Render home component on state set to true
    if (parseInt(sessionStorage.getItem("isLoggedIn")) === 1) {
      return (
        <Router>
          <Header handleLogin={this.handleUserLogin}></Header>
          <Navbar></Navbar>
          <Switch>
            <Route exact path="/">
              <Redirect to="/home"></Redirect>
            </Route>
            <Route exact path="/login">
              <Redirect to="/home"></Redirect>
            </Route>
            <Route
              exact
              path="/home"
              render={(props) => (
                <Home {...props} handleLogin={this.handleUserLogin}></Home>
              )}
            />
            <Route
              exact
              path="/configuration"
              render={(props) => (
                <Configuration
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></Configuration>
              )}
            />
            <Route
              exact
              path="/uploadmap"
              render={(props) => (
                <UploadMap
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></UploadMap>
              )}
            />
            <Route
              exact
              path="/zoneconfig"
              render={(props) => (
                <ZoneConfig
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></ZoneConfig>
              )}
            />
            <Route
              exact
              path="/tracking"
              render={(props) => (
                <Tracking
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></Tracking>
              )}
            />
            <Route
              exact
              path="/assets"
              render={(props) => (
                <Assets {...props} handleLogin={this.handleUserLogin}></Assets>
              )}
            />
            <Route
              exact
              path="/systemhealth"
              render={(props) => (
                <SystemHealth
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></SystemHealth>
              )}
            />
            <Route
              exact
              path="/thermalmap"
              render={(props) => (
                <Temperature
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></Temperature>
              )}
            />
            <Route
              exact
              path="/dailyreport"
              render={(props) => (
                <Reports
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></Reports>
              )}
            />
            <Route
              exact
              path="/alerts"
              render={(props) => (
                <Alerts {...props} handleLogin={this.handleUserLogin}></Alerts>
              )}
            />
            <Route
              exact
              path="/employeeRegistration"
              render={(props) => (
                <EmployeeRegistration
                  {...props}
                  handleLogin={this.handleUserLogin}
                ></EmployeeRegistration>
              )}
            />
          </Switch>
        </Router>
      );
    } else {
      return (
        <Router>
          <Route path="/">
            <Redirect to="/login"></Redirect>
          </Route>
          <Route
            exact
            path="/login"
            render={(props) => (
              <Login {...props} handleLogin={this.handleUserLogin}></Login>
            )}
          />
        </Router>
      );
    }
  }
}

export default App;
