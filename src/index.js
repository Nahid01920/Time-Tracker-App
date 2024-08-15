import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App3 from './Main/Pages/app3';

// import DynamicForm from './Main/Pages/GoogleSignInButton';
import './App.css';
import './index.css';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App3 />
      {/* <DynamicForm /> */}
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
