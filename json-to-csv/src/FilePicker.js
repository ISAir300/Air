import React from 'react';
import axios from 'axios';

const FilePicker = () => {
  // Create a ref to access the file input DOM element
  const fileInputRef = React.createRef();

  const uploadFiles = async () => {
    // Get the list of files from the file input element
    const files = fileInputRef.current.files;

    // Create a new FormData instance
    const formData = new FormData();

    // Append each file to the form data
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    // Use axios to send a POST request to the server with the form data
    try {
      await axios.post('/api/upload', formData);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div>
      {/* File input element; 'multiple' attribute allows selecting multiple files */}
      <input type="file" accept=".json" multiple ref={fileInputRef} />

      {/* Button that triggers the file upload when clicked */}
      <button onClick={uploadFiles}>Upload</button>
    </div>
  );
};

export default FilePicker;
