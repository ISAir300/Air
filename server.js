const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csvToJson = require('convert-csv-to-json');
const path = require('path');
const { Parser } = require('json2csv');
const cors = require('cors');

const app = express();

// multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.static('jsonFiles'));
app.use(express.static('csvFiles'));

app.post('/api/upload/json', upload.array('files'), (req, res) => {
  req.files.forEach(file => {
    if (path.extname(file.originalname) !== '.json') {
      res.status(400).send(`Unsupported file type for ${file.originalname}. Only .json files are supported.`);
      return;
    }

    const jsonFilePath = path.join(__dirname, file.originalname);
    const csvFilePath = path.join(__dirname, 'csvFiles', `${file.originalname}.csv`);

    let json = require(jsonFilePath);
    let parser = new Parser();
    let csv = parser.parse(json);

    fs.writeFile(csvFilePath, csv, function (err) {
      if (err) {
        console.error(`Error writing file ${csvFilePath}:`, err);
        return;
      }
      console.log('Saved!');

      // delete original file after conversion
      fs.unlink(jsonFilePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${jsonFilePath}:`, err);
          return;
        }
        console.log(`${jsonFilePath} was deleted`);
      });
    });
  });
  res.status(200).send('Files uploaded successfully');
});

app.post('/api/upload/csv', upload.array('files'), (req, res) => {
  req.files.forEach(file => {
    if (path.extname(file.originalname) !== '.csv') {
      res.status(400).send(`Unsupported file type for ${file.originalname}. Only .csv files are supported.`);
      return;
    }

    const csvFilePath = path.join(__dirname, file.originalname);
    const jsonFilePath = path.join(__dirname, 'jsonFiles', `${file.originalname}.json`);

    let json = csvToJson.fieldDelimiter(',').getJsonFromCsv(csvFilePath);

    fs.writeFile(jsonFilePath, JSON.stringify(json, null, 4), function (err) {
      if (err) {
        console.error(`Error writing file ${jsonFilePath}:`, err);
        return;
      }
      console.log('Saved!');

      // delete original file after conversion
      fs.unlink(csvFilePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${csvFilePath}:`, err);
          return;
        }
        console.log(`${csvFilePath} was deleted`);
      });
    });
  });
  res.status(200).send('Files uploaded successfully');
});

// CHANGE HERE TO: Your actual port number if it's not provided by the hosting platform
app.listen(process.env.PORT || 3001, () => {
  console.log('Server is running on port 3001');
});
