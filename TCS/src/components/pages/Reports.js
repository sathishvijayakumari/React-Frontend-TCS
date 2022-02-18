import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import $ from "jquery";
import "./Styling.css";
import { employeeRegistration } from "../../urls/apis";

// Styling property for Underline Image
const Underline = {
  width: "75px",
  height: "9px",
  position: "absolute",
};

class Reports extends Component {
  /** Method is called on Component Load */
  componentDidMount() {
    // API call to get the all asset details
    axios({ method: "GET", url: employeeRegistration + "?key=all" })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          if (response.data.length !== 0) {
            $("reportsTable").empty();
            var dt = response.data;
            for (let i = 0; i < dt.length; i++) {
              let tagid = "NOT ASSIGNED";
              let intime = "--:--:--";
              let lastseen = "--:--:--";
              if (dt[i].tagid) {
                tagid = dt[i].tagid.tagid;
                intime =
                  dt[i].intime.substr(0, 10) + " " + dt[i].intime.substr(11, 8);
                lastseen =
                  dt[i].tagid.lastseen.substr(0, 10) +
                  " " +
                  dt[i].tagid.lastseen.substr(11, 8);
              }
              $("#reportsTable").append(
                "<tr>" +
                  "<td>" +
                  (1 + i) +
                  "</td>" +
                  "<td>" +
                  dt[i].name +
                  "</td>" +
                  "<td>" +
                  dt[i].email +
                  "</td>" +
                  "<td>" +
                  tagid +
                  "</td>" +
                  "<td>" +
                  intime +
                  "</td>" +
                  "<td>" +
                  lastseen +
                  "</td>" +
                  "</tr>"
              );
            }
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          $("#report-displayModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else {
          $("#report-error").text(
            "Request Failed with status code (" + error.response.status + ")."
          );
        }
      });
  }

  /** Terminate the session on forbidden (403) error */
  sessionTimeout = () => {
    $("#report-displayModal").css("display", "none");
    sessionStorage.setItem("isLoggedIn", 0);
    this.props.handleLogin(0);
  };

  /** Redern the html content on the browser */
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Reports</title>
        </Helmet>
        <div className="panel">
          <span className="main-heading">Reports</span>
          <br />
          <img alt="" src="../images/Tiles/Underline.png" style={Underline} />

          <div className="container fading" style={{ marginTop: "50px" }}>
            <p className="error-msg" id="report-error"></p>
            {/* SIGNAL REPEATER TAGS TABLE */}
            <div className="container">
              <span className="heading">Employee Daily Report</span>
              <br />
              <img
                src="../images/Tiles/Underline.png"
                alt=""
                style={{
                  width: "56px",
                  height: "3px",
                  marginTop: "2px",
                  position: "absolute",
                }}
              />
              {/* Table displays Sensor tags registered */}
              <table
                style={{
                  marginTop: "20px",
                  marginBottom: "30px",
                }}
              >
                <thead>
                  <tr>
                    <th>Sl.No</th>
                    <th>NAME</th>
                    <th>MAIL ID</th>
                    <th>MAC ID</th>
                    <th>IN TIME</th>
                    <th>LAST SEEN</th>
                  </tr>
                </thead>
                <tbody id="reportsTable"></tbody>
              </table>
              {/* Page navigation options for sensor tags */}
              <div
                style={{
                  textAlign: "center",
                  display: "none",
                }}
              >
                <p style={{ float: "left", fontFamily: "Roboto-Regular" }}>
                  ( <span id="currentpage">0</span> /
                  <span id="numberofpages">0</span> )
                </p>
                <button
                  id="previous"
                  onClick={this.previousSPage}
                  style={{ fontFamily: "Roboto-Medium" }}
                >
                  Previous
                </button>
                <button
                  id="next"
                  onClick={this.nextSPage}
                  style={{ fontFamily: "Roboto-Medium" }}
                >
                  Next
                </button>
                <p style={{ float: "right", fontFamily: "Roboto-Regular" }}>
                  Row count : <span id="rowCount">0</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Display modal to display error messages */}
        <div id="report-displayModal" className="modal">
          <div className="modal-content">
            <p id="content" style={{ textAlign: "center" }}></p>
            <button
              id="ok"
              className="btn-center btn success-btn"
              onClick={this.sessionTimeout}
            >
              OK
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Reports;
