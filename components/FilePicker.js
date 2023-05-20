import React, { useState } from 'react';
import axios from 'axios';

const FilePicker = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileSelect = (e) => {
    setSelectedFiles(e.target.files);
  };

  const uploadFiles = async (type) => {
    const files = selectedFiles;
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    try {
      const promises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            resolve({
              data: reader.result,
              filename: file.name,
            });
          };

          reader.onerror = () => {
            reject(new Error('Error reading file.'));
          };

          reader.readAsArrayBuffer(file);
        });
      });

      const fileDataArray = await Promise.all(promises);
      const formData = new FormData();

      fileDataArray.forEach(({ data, filename }) => {
        formData.append('files', new Blob([data]), filename);
      });

      console.log("wtf");
      console.log(formData);
      await axios.post('/api/upload/json', formData, config); // Adjusted API endpoint

      setSuccessMessage(`Successful conversion of ${type.toUpperCase()} file(s)`);
    } catch (error) {
      console.error('Error uploading files:', error);
      setSuccessMessage(`Error in conversion of ${type.toUpperCase()} file(s)`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>File Converter</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Select JSON Files</h2>
        <input type="file" accept=".json" multiple onChange={handleFileSelect} />
        <button disabled={!selectedFiles} onClick={() => uploadFiles('json')}>
          Upload and Convert to CSV
        </button>
      </div>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default FilePicker;
