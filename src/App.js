import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Details from './Main/Dashboard/Details';
import LogIn from './Main/LogIn/LogIn';
import Signup from './Main/Registration/Signup';
import TimeEntry from './Main/TimeEntry/TimeEntry';
// import Dashboard from './Dashboard';
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/LogIn' element={<LogIn/>}/>
        {/* <Route path='/Dashboard' element={<Dashboard />}/> */}
        <Route path='/TimeEntry' element={<TimeEntry />} />
        <Route path='/Details' element={<Details />} />
      </Routes>
      
    </>
  );
}

export default App;
