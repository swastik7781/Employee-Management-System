import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import PayrollPage from './pages/PayrollPage';
import PerformancePage from './pages/PerformancePage';
import SettingsPage from './pages/SettingsPage';

function App() {
    const { isAuthenticated } = useAuthStore();

    return (
        <Routes>
            <Route
                path="/login"
                element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />}
            />

            <Route
                path="/"
                element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}
            >
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="employees" element={<EmployeesPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="leaves" element={<LeavePage />} />
                <Route path="payroll" element={<PayrollPage />} />
                <Route path="performance" element={<PerformancePage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
}

export default App;
