import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { CssBaseline } from '@mui/material';

import Login from './pages/Account/Login';
import ForgotPassword from './pages/Account/ForgotPassword';
import Topbar from './pages/global/Topbar';

import DashboardAdmin from './pages/Dashboard/DashboardAdmin';
import AdminSidebar from './pages/Dashboard/AdminSidebar';
import User from './pages/Menu/User';
import Facilities from './pages/Menu/Facilities';
import SchedulingList from './pages/Menu/SchedulingList';
import PendingSchedule from './pages/Menu/PendingSchedule';
import ApprovedSchedule from './pages/Menu/ApprovedSchedule';
import DisapprovedSchedule from './pages/Menu/DisapprovedSchedule';




const App = () => {
  const { isAuthenticated, userData } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Function to determine where to redirect based on user role
  const getRedirectPath = () => {
    if (userData.role === 'ADMIN') return '/admin-dashboard';
    return '/';
  };

  return (
    <Router>
        <CssBaseline />
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            {isAuthenticated && userData.role === 'ADMIN' && (
              <AdminSidebar className="sidebar" isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed}  />
            )}


            <main style={{ flexGrow: 1, overflowX: 'hidden' }}>
              {isAuthenticated && <Topbar setIsSidebar={setIsSidebarCollapsed} className="topbar"/>}
              <Routes>
                <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to={getRedirectPath()} />} />
                <Route path="/admin-dashboard" element={isAuthenticated && userData.role === 'ADMIN' ? <DashboardAdmin /> : <Navigate to="/" />} />
                
                <Route path="/user" element={isAuthenticated && userData.role === 'ADMIN' ? <User /> : <Navigate to="/" />} />
                <Route path="/facilities" element={isAuthenticated && userData.role === 'ADMIN' ? <Facilities /> : <Navigate to="/" />} />
                
                <Route path="/scheduling-list" element={isAuthenticated && userData.role === 'ADMIN' ? <SchedulingList /> : <Navigate to="/" />} />

                <Route path="/pending-schedule" element={isAuthenticated && userData.role === 'ADMIN' ? <PendingSchedule /> : <Navigate to="/" />} />
                <Route path="/approved-schedule" element={isAuthenticated && userData.role === 'ADMIN' ? <ApprovedSchedule /> : <Navigate to="/" />} />
                <Route path="/disapproved-schedule" element={isAuthenticated && userData.role === 'ADMIN' ? <DisapprovedSchedule /> : <Navigate to="/" />} />

                
                {/*FORGOT PASSWORD SECTION*/}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
    </Router>
  );
};

export default App;
