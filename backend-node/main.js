const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use("/Pics", express.static(path.join(__dirname, "Pics")));

// POST endpoint to save image data
app.post("/saveImage", (req, res) => {
  const { imageUrl, time } = req.body; // Assuming the image URL is sent as "imageUrl" and "time" in the request body

  if (!imageUrl || !time) {
    return res
      .status(400)
      .json({ error: "Missing imageUrl or time in the request body" });
  }

  // Generate the filename based on the provided 'time'
  const filename = `${time}.png`;
  const imagePath = path.join(__dirname, "Pics", filename); // Save in the /Pics directory relative to this script

  // Download the image using axios (you need to install the 'axios' package)
  const axios = require("axios");

  axios
    .get(imageUrl, {
      responseType: "arraybuffer",
    })
    .then((response) => {
      const imageBuffer = Buffer.from(response.data);

      // Save the image data to the server using the 'fs' module
      fs.writeFile(imagePath, imageBuffer, (err) => {
        if (err) {
          console.error("Error saving image to file:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        console.log(filename, " saved!");
        return res
          .status(200)
          .json({ message: "Image saved successfully", imageUrl: filename });
      });
    })
    .catch((error) => {
      console.error("Error downloading image:", error);
      return res.status(500).json({ error: "Internal server error" });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
