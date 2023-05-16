const express = require('express');
const multer = require('multer'); // Multer is a middleware for handling multipart/form-data (file uploads)
const json2csv = require('json2csv').parse;
const fs = require('fs');
const path = require('path');

const app = express();

// Configure Multer to store uploaded files in the 'uploads/' directory
const upload = multer({ dest: 'uploads/' });

// Define an endpoint for file upload
app.post('/api/upload', upload.array('files'), (req, res) => {
  // Process each uploaded file
  req.files.forEach(file => {
    // Read the file
    fs.readFile(file.path, 'utf8', (err, jsonString) => {
      if (err) {
        console.log(`Error reading file ${file.path}:`, err);
        return;
      }

      // Parse JSON string to an array
      const jsonArray = JSON.parse(jsonString);

      // Convert JSON to CSV
      const csvData = json2csv(jsonArray);

      // Define the output filename
      const outputFilename = path.join('csvFiles', path.basename(file.originalname, '.json') + '.csv');

      // Write CSV data to the output file
      fs.writeFile(outputFilename, csvData, function (error) {
        if (error) {
          console.error('write error:  ', error.message);
        } else {
          console.log(`Successful Write to ${outputFilename}`);
        }
      });
    });
  });

  // Send a successful response
  res.status(200).send();
});

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
