import React from 'react';
import FilePicker from './FilePicker'; // Assuming FilePicker.js is in the same directory

function App() {
  return (
    <div className="App">
      <h1>JSON/CSV Converter</h1>
      <FilePicker convertType='json' />
      <FilePicker convertType='csv' />
    </div>
  );
}

export default App;
