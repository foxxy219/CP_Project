import React from 'react';
import LoginPage from './components/LoginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homepage_user';
import unsuccessfulLogin from './components/unsuccessfulLogin';
import { useState } from 'react';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/unsuccessful-login" element={<unsuccessfulLogin />} />
            </Routes>
        </Router>
    );
};

export default App;
