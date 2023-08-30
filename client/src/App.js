import React from 'react';
import LoginPage from './components/LoginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homepage_user';
import AuthChecker from './components/AuthChecker';
import SidebarLeft from './public/global/Sidebar';
import Topbar from './public/global/Topbar';
import { useState } from 'react';
import { useMode } from './theme';


const App = () => {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthChecker />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={
                    <>
                    <SidebarLeft isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
                    <main className= "content">
                        <Topbar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
                        <HomePage />
                    </main>
                    </>
                } />
            </Routes>
        </Router>
    );
};

export default App;
