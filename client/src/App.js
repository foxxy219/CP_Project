import React from 'react';
import LoginPage from './components/LoginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import HomePage from './components/homepage_user';
import AuthChecker from './components/AuthChecker';
import SidebarLeft from './public/global/Sidebar';
import Topbar from './public/global/Topbar';
import Form from './public/form/index';
import Dashboard from './public/dashboard/index';
import ClockInfo from './public/ClockInfo/index';
import { useState } from 'react';
import { ColorModeContext, useMode } from './theme';
import AppLayout from './layout/AppLayout';


const App = () => {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthChecker />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="home" element={<AppLayout><Dashboard/></AppLayout>} />
                <Route path="home/form" element={<AppLayout><Form /></AppLayout>} />
                <Route path="home/clock-info" element={<AppLayout><ClockInfo /></AppLayout>} />
            </Routes>
        </Router >
    );
};

export default App;
