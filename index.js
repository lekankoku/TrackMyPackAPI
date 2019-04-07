const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
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
      if (!trackingData) {
        res.status(404).send("Not found.");
      }
      res.send(trackingData);
    } else {
      const trackingData = await getGLSTrackingData(
        trackingNumber,
        resultsLanguage
      );
      if (!trackingData) {
        res.status(404).send("Not found.");
      }
      res.send(trackingData);
    }
  } catch (e) {
    res.status(500).send("server error");
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log("server running on PORT 4000");
});
