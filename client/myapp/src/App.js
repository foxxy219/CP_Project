import React from 'react';
import LoginPage from './components/LoginPage';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import HomePage from './components/homepage_user';

const App = () => {
  return (
      <Router>
          <Routes>
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/home" element={<HomePage/>} />
          </Routes>
      </Router>
  );
};

export default App;
