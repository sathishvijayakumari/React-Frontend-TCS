import React, { Fragment, PureComponent } from "react";
import axios from "axios";
import "./Styling.css";
import $ from "jquery";
import { slaveGateway } from "../../urls/apis";

import mqtt from "mqtt";

class RelayController extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.slaveGatewayList();
  };

  slaveGatewayList = () => {
    $("#slavelist").empty();
    axios({ method: "GET", url: slaveGateway })
      .then((response) => {
        if (response.status === 200) {
          let slave = response.data;
          $("#slaveHealth").empty();
          if (slave.length !== 0) {
            for (let i = 0; i < slave.length; i++) {
              $("#slavelist").append(
                "<option>" + slave[i].gatewayid + "</option>"
              );
            }
          } else {
            $("#relay-error").text("No slave gate is registered.");
            $("#relay_form").css("display", "none");
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          $("#realy_displayModal").css("display", "block");
          $("#relay-content").text(
            "User Session has timed out. Please Login again."
          );
        } else {
          $("#sys-error").text(
            "Slave Gateway : Request failed with status code " +
              error.response.status
          );
        }
      });
  };

  updateRelayController = (e) => {
    e.preventDefault();
    console.log('==========>updateRelayController');
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
        console.log('==========>Connected');
      });
    } catch (err) {
      console.log(err);
    }
    // $("#relay-success").text("");
    // $("#relay-error").text("");
    // let data = {
    //   macaddress: $("#slavelist").val(),
    //   relay0: false,
    //   relay1: false,
    //   relay2: false,
    //   relay3: false,
    //   relay4: false,
    //   relay5: false,
    // };
    // let relayList = $("input[type=checkbox]");
    // for (let i = 0; i < relayList.length; i++) {
    //   data[$("input[type=checkbox]").eq(i).attr("id")] = $(
    //     "input[type=checkbox]"
    //   )
    //     .eq(i)
    //     .is(":checked");
    // }

    // axios({ method: "POST", url: "/api/slaverelayconfig", data: data })
    //   .then((response) => {
    //     if (response.status === 200 || response.status === 201) {
    //       $("#relay-success").text("Relay Configuration Updated successfully.");
    //       try {
    //         let client = mqtt.connect({
    //           host: "ws:192.168.0.101",
    //           port: 9001,
    //           keepalive: 60,
    //         });
    //         let options = {
    //           QOS: 1,
    //           retain: true,
    //         };
    //         client.on("connect", () => {
    //           client.publish(
    //             "vacus/master/relay-config",
    //             JSON.stringify(data),
    //             options
    //           );
    //         });
    //       } catch (err) {
    //         console.log(err);
    //       }
    //     } else if (response.status === 208) {
    //       $("#relay-success").text(
    //         "Match with last updated Relay Configuration data."
    //       );
    //     } else {
    //       $("#relay-error").text("Unable to update Relay Configuration.");
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.response.status === 403) {
    //       $("#realy_displayModal").css("display", "block");
    //       $("#relay-content").text(
    //         "User Session has timed out. Please Login again."
    //       );
    //     } else {
    //       $("#relay-error").text(
    //         "Slave Gateway : Request failed with status code " +
    //           error.response.status
    //       );
    //     }
    //   });
  };

  sessionTimeout = () => {
    $("#realy_displayModal").css("display", "none");
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
          <span className="error-msg" id="relay-error"></span>
          <span className="success-msg" id="relay-success"></span>
        </div>
        <form id="relay_form">
          <div className="input-group">
            <span className="label">Slave ID : </span>
            <select id="slavelist"></select>
          </div>
          <div className="input-group" style={{ display: "table" }}>
            <span className="label">Relay 0 : </span>
            <input type="checkbox" id="relay0" /> (On / Off)
          </div>
          <div className="input-group" style={{ display: "table" }}>
            <span className="label">Relay 1 : </span>
            <input type="checkbox" id="relay1" /> (On / Off)
          </div>
          <div className="input-group" style={{ display: "table" }}>
            <span className="label">Relay 2 : </span>
            <input type="checkbox" id="relay2" /> (On / Off)
          </div>
          <div className="input-group" style={{ display: "table" }}>
            <span className="label">Relay 3 : </span>
            <input type="checkbox" id="relay3" /> (On / Off)
          </div>
          <div className="input-group" style={{ display: "table" }}>
            <span className="label">Relay 4 : </span>
            <input type="checkbox" id="relay4" /> (On / Off)
          </div>
          <div className="input-group" style={{ display: "table" }}>
            <span className="label">Relay 5 : </span>
            <input type="checkbox" id="relay5" /> (On / Off)
          </div>
          <div className="input-group">
            <input
              type="submit"
              value="Update"
              className="btn success-btn"
              onClick={this.updateRelayController}
            />
          </div>
        </form>
        {/* Display modal to display error messages */}
        <div id="realy_displayModal" className="modal">
          <div className="modal-content">
            <p id="relay-content" style={{ textAlign: "center" }}></p>
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

export default RelayController;
