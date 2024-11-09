import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />           
        <Route path="/app/*" element={<App />} />     
             
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
