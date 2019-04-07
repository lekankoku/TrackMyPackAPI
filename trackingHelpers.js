const axios = require("axios");
async function getDHLTrackingData(trackingNumber, resultsLanguage) {
  try {
    const data = await axios.get(
      "https://www.dhl.de/int-verfolgen/data/search?",
      {
        params: {
          piececode: trackingNumber,
          language: resultsLanguage
        }
      }
    );

    const { sendungsdetails } = data.data.sendungen[0];
    const { sendungsnummern, sendungsverlauf, istZugestellt } = sendungsdetails;
    const events = sendungsverlauf.events.map(event => {
      return {
        status: event.status,
        location: event.ort,
        time: event.datum.slice(0, 10),
        time: event.datum.slice(11, 19)
      };
    });
    const details = {
      trackingNumber: trackingNumber,
      events,
      isDelivered: istZugestellt,
      courier: "DHL"
    };

    return details;
  } catch (err) {
    console.log(err);
  }
}
async function getGLSTrackingData(trackingNumber, resultsLanguage) {
  try {
    const data = await axios.get(
      `https://gls-group.eu/app/service/open/rest/DE/${resultsLanguage}/rstt001?`,
      {
        params: {
          match: trackingNumber,
          caller: "witt002",
          milis: "1553062260521"
        }
      }
    );
    const { history, tuNo, progressBar } = data.data.tuStatus[0];
    const events = history
      .map(event => {
        return {
          status: event.evtDscr,
          location: event.address.city,
          date: event.date,
          time: event.time
        };
      })
      .reverse();

    const isDelivered = progressBar.statusInfo === "DELIVERED" ? true : false;

    const details = {
      trackingNumber: tuNo,
      events,
      isDelivered,
      courier: "GLS"
    };
    return details;
  } catch (err) {
    console.log(err);
  }
}

module.exports.getGLSTrackingData = getGLSTrackingData;
module.exports.getDHLTrackingData = getDHLTrackingData;
