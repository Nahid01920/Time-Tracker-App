import React, { useState } from 'react';
import Rout from '../App';
function App() {
  const [userData, setUserData] = useState("");

  return (
    <>
      <Rout setUserData={setUserData} userData={userData} />
    </>
  );
}

export default App;