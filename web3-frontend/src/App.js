import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/index';
import Register from './pages/Auth/Register';
import SignInPage from './pages/Auth/Login';
import "./App.css"

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<SignInPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
  );
}

export default App;
