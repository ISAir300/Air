const express = require('express');
const multer = require('multer');
const csvToJson = require('convert-csv-to-json');
const path = require('path');
const { Parser } = require('json2csv');
const archiver = require('archiver');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Function to convert JSON to CSV
const convertJsonToCsv = async (file) => {
  const jsonFilePath = path.join(__dirname, file.originalname);
  let json = require(jsonFilePath);

  if (json.hasOwnProperty('metadata')) {
    json.metadata = json.metadata.decision;
  }

  let parser = new Parser();
  let csv = parser.parse(json);

  const csvFilename = path.basename(file.originalname, '.json') + '.csv';

  return { csv, csvFilename };
};

router.post('/json', upload.array('files'), async (req, res) => {
  try {
    console.log('Received files:', req.files); // Log the received files
    console.log('Received fields:', req.body); // Log any additional fields sent with FormData

    let conversionPromises = req.files.map(file => convertJsonToCsv(file));

    let archive = archiver('zip');

    // Wait for all files to be converted and appended to the archive
    await Promise.all(conversionPromises.map(async promise => {
      let { csv, csvFilename } = await promise;
      archive.append(csv, { name: csvFilename });
    }));

    archive.finalize();

    res.attachment('converted_files.zip');
    archive.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while converting files');
  }
});

module.exports = router;
