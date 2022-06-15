import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Loader from './components/Loader';
import Sidebar from './components/Sidebar';
import {useStateContext} from './contexts/ContextProvider';
import Form from './pages/Form';
import State from './pages/State';
import Statistics from './pages/Statistics';

function App() {
    const {loading} = useStateContext()
    useEffect(() => {
        document.title = "CDG Monitor"
    }, [])
    return (
        <div className='bg-main-bg'>
            {loading && <Loader/>}
            <BrowserRouter>
                <div className='flex relative w-full'>
                    <Sidebar/>
                    <div className='relative w-full mt-24 min-h-screen flex-2 ml-72'>
                        <div className='flex flex-wrap justify-center overflow-hidden'>
                            <Routes>
                                <Route path='/' element={<Form/>}/>
                                <Route path='/stats/:id' element={<Statistics/>}/>
                                <Route path='/state/:id' element={<State/>}/>
                            </Routes>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
