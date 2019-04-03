const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json({ type: "*/*" }));
const { getDHLTrackingData, getGLSTrackingData } = require("./trackingHelpers");
app.post("/trackpackage", async (req, res, next) => {
  try {
    let { courier, trackingNumber, systemLang } = req.body;
    const resultsLanguage = systemLang === "de" ? "de" : "en";

    if (courier === "DHL") {
      const trackingData = await getDHLTrackingData(
        trackingNumber,
        resultsLanguage
      );
      console.log(trackingData);
      res.send(trackingData);
    } else {
      const trackingData = await getGLSTrackingData(
        trackingNumber,
        resultsLanguage
      );
      console.log(trackingData);
      res.send(trackingData);
    }
  } catch (e) {
    console.log("console.error();");
  }
});

app.listen(8000, () => {
  console.log("server running on PORT 4000");
});
