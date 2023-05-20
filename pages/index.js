import React from 'react';
import dynamic from 'next/dynamic';

const FilePicker = dynamic(() => import('../components/FilePicker'), {
  ssr: false, // Load the component only on the client-side
});

const Home = () => {
  return (
    <div>
      <FilePicker />
    </div>
  );
};

export default Home;
