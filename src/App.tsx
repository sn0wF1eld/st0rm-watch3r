import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Form from './pages/Form';
import State from './pages/State';
import Statistics from './pages/Statistics';

function App() {
  return (
    <div>
      <BrowserRouter>
      <div className='flex relative bg-main-bg w-full'>
        <Navbar />
        <div className='relative w-full mt-24 h-full'>
        <Routes>
          <Route path='/' element={<Form />} />
          <Route path='/stats' element={<Statistics />} />
          <Route path='/state' element={<State />} />
        </Routes>
        </div>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
