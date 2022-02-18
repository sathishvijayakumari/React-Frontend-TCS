import React, { Fragment, PureComponent } from "react";
import axios from "axios";
import "./Styling.css";
import $ from "jquery";

import mqtt from "mqtt";

class OTAParams extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};

  otaparams = (e) => {
    $("#ota-error").text("");
    $("#ota-success").text("");
    e.preventDefault();
    let data = {
      macaddress: $("#macid1").val(),
      freq: $("#freq").val(),
      power: $("#power").val(),
      channel: $("#channel").val(),
      update: $("#rate").val(),
      buzzer: $("#buzzer").val(),
      led: $("#led").val(),
      action: 0,
    };
    if (
      data.macaddress !== "" &&
      data.freq !== "" &&
      data.power !== "" &&
      data.channel !== "" &&
      data.update !== "" &&
      data.buzzer !== "" &&
      data.led !== ""
    ) {
      if ($("#action").is(":checked")) data.action = 1;
      // axios.defaults.xsrfHeaderName = "x-csrftoken";
      // axios.defaults.xsrfCookieName = "csrftoken";
      // axios.defaults.withCredentials = true;
      axios({ method: "POST", url: "/api/otaconfig", data: data })
        .then((response) => {
          // console.log(response);
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200)
              $("#ota-success").text("OTA parameter updated successfully.");
            else if (response.status === 201)
              $("#ota-success").text(
                data.macaddress + " is configured and updated successfully."
              );

            try {
              let client = mqtt.connect({
                host: "ws:192.168.0.101",
                port: 9001,
                keepalive: 60,
              });
              let options = {
                QOS: 1,
                retain: true,
              };
              client.on("connect", () => {
                client.publish(
                  "vacus/slave/config",
                  JSON.stringify(data),
                  options
                );
              });
            } catch (err) {
              console.log(err);
            }
          } else if (response.status === 208) {
            $("#ota-success").text("Match with last updated parameters.");
          } else {
            $("#ota-error").text("Unable to update OTA parameters.");
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            $("#ota_displayModal").css("display", "block");
            $("#ota-content").text(
              "User Session has timed out. Please Login again."
            );
          } else {
            $("#ota-error").text(
              "Slave Gateway : Request failed with status code " +
                error.response.status
            );
          }
        });
    } else {
      $("#ota-error").text("Please enter all fields.");
    }
  };

  sessionTimeout = () => {
    $("#ota_displayModal").css("display", "none");
    this.props.timeOut();
  };

  render() {
    return (
      <Fragment>
        {/* <span className="sub-heading">Asset Registration</span>
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
        <br></br> */}
        <div>
          {/* Element for displaying error messages */}
          <span className="error-msg" id="ota-error"></span>
          <span className="success-msg" id="ota-success"></span>
        </div>
        <form>
          <div className="input-group">
            <span className="label">MAC ID : </span>
            <input
              type="text"
              id="macid1"
              required="required"
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <span className="label">Update Rate (sec) : </span>
            <input
              type="number"
              id="rate"
              min="5"
              max="60"
              required="required"
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <span className="label">Transaction Power : </span>
            <input
              type="number"
              id="power"
              min="0"
              max="2"
              required="required"
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <span className="label">Base Frequency : </span>
            <input
              type="number"
              id="freq"
              min="0"
              max="5"
              required="required"
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <span className="label">Channel : </span>
            <input
              type="number"
              id="channel"
              min="0"
              max="80"
              required="required"
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <span className="label">Buzzer : </span>
            <input
              type="number"
              id="buzzer"
              min="0"
              max="1"
              required="required"
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <span className="label">LED : </span>
            <input type="number" id="led" min="0" max="1" required="required" />
          </div>
          <div className="input-group">
            <span className="label">Update Immediately : </span>
            <input type="checkbox" id="action" required="required" />
          </div>
          <div className="input-group">
            <input
              type="submit"
              value="Update"
              className="btn success-btn"
              onClick={this.otaparams}
            />
          </div>
        </form>
        {/* Display modal to display error messages */}
        <div id="ota_displayModal" className="modal">
          <div className="modal-content">
            <p id="ota-content" style={{ textAlign: "center" }}></p>
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

export default OTAParams;
