import React, { useState } from 'react';
import axios from 'axios';

const FilePicker = () => {
  const fileInputRefJson = React.createRef();
  const fileInputRefCsv = React.createRef();
  const [successMessage, setSuccessMessage] = useState('');

  const uploadFiles = async (type) => {
    const files = type === 'json' ? fileInputRefJson.current.files : fileInputRefCsv.current.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      await axios.post(`/api/upload/${type}`, formData);
      setSuccessMessage(`Successful conversion of ${type.toUpperCase()} file(s)`);
    } catch (error) {
      console.error('Error uploading files:', error);
      setSuccessMessage(`Error in conversion of ${type.toUpperCase()} file(s)`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>File Converter</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <label>
            <h2>Select JSON Files</h2>
            <input type="file" accept=".json" multiple ref={fileInputRefJson} style={{ display: 'block' }} />
          </label>
          <button onClick={() => uploadFiles('json')}>Upload and Convert to CSV</button>
        </div>
        <div>
          <label>
            <h2>Select CSV Files</h2>
            <input type="file" accept=".csv" multiple ref={fileInputRefCsv} style={{ display: 'block' }} />
          </label>
          <button onClick={() => uploadFiles('csv')}>Upload and Convert to JSON</button>
        </div>
      </div>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default FilePicker;
