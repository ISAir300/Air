const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const _ = require('lodash');
const csv = require('csvtojson');

const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

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

    // Flatten the 'metadata' property
    json = json.map(item => {
      item.metadata = item.metadata.decision;
      return item;
    });

    let parser = new Parser();
    let csv = parser.parse(json);

    fs.writeFile(csvFilePath, csv, function (err) {
      if (err) {
        console.error(`Error writing file ${csvFilePath}:`, err);
        return;
      }

      fs.unlink(jsonFilePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${jsonFilePath}:`, err);
          return;
        }
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

    csv()
    .fromFile(csvFilePath)
    .then((json) => {
      // Convert the 'metadata' property back to an object
      json = json.map(item => {
        item.metadata = { decision: item.metadata };
        return item;
      });

      fs.writeFile(jsonFilePath, JSON.stringify(json, null, 4), function (err) {
        if (err) {
          console.error(`Error writing file ${jsonFilePath}:`, err);
          return;
        }

        fs.unlink(csvFilePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${csvFilePath}:`, err);
            return;
          }
        });
      });
    });
  });
  res.status(200).send('Files uploaded successfully');
});

app.listen(3001, () => {
  console.log('Server is running on port 3001')
});