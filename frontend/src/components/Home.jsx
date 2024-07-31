// import React from 'react'
// import { useLocation } from 'react-router-dom'

// const Home = () => {
//     const location = useLocation()
//   return (
//     <div>
//         <h1>Hello {location.state.id}</h1>
//     </div>
//   )
// }

// export default Home

import React from 'react';

import { useNavigate ,  useLocation  } from 'react-router-dom';
import "../App.css"
// import Popup from './Popup';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate("/login");
  };
 
  return (
    <div>
      
      <h1>Hello {location.state.id}</h1>
      <button onClick={handleLogout}>Logout</button>
     
    </div>
  );
};

export default Home;
