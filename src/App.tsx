import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Form from './pages/Form';
import State from './pages/State';
import Statistics from './pages/Statistics';

function App() {
  return (
    <div className='bg-main-bg'>
      <BrowserRouter>
      <div className='flex relative w-full'>
        <Sidebar />
        <div className='relative w-full mt-24 min-h-screen flex-2 ml-72'>
          <div className='flex flex-wrap justify-center'>
            <Routes>
              <Route path='/' element={<Form />} />
              <Route path='/stats' element={<Statistics />} />
              <Route path='/state' element={<State />} />
            </Routes>
          </div>
        </div>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
