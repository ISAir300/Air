import React, { useState } from 'react';

function FilePicker({ convertType }) {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Post request to server
  const handleFileUpload = async (event) => {
    let files = event.target.files;
    let formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    // CHANGE HERE TO: Your actual server URL 
    let serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';
    
    let apiEndpoint = `${serverURL}/api/upload/${convertType}`;

    let response = await fetch(apiEndpoint, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      setSuccessMessage(`Files uploaded and converted to ${convertType.toUpperCase()} successfully.`);
    } else {
      setErrorMessage(`Failed to upload files. ${response.status}: ${response.statusText}`);
    }
  };

  return (
    <div>
      <h2>Upload {convertType.toUpperCase()} to convert to {convertType === 'json' ? 'CSV' : 'JSON'}</h2>
      <input type="file" multiple onChange={handleFileUpload} accept={`.${convertType}`} />
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default FilePicker;
