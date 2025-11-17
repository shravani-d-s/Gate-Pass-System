import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterStudent from './pages/registerStudent';
import RegisterAdmin from './pages/registerAdmin';
import Login from './pages/login';
import StudentDashboard from './pages/studentDashboard';
import AdminDashboard from './pages/adminDashboard';
import DatabaseAdmin from './pages/DatabaseAdmin';
import ProtectedRoute from './components/protectedRoutes';
import GatePassVerify from './pages/gatePassVerify';   // <-- IMPORTANT

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/register-student" element={<RegisterStudent />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/database-admin" element={<DatabaseAdmin />} />

          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ⭐ NEW ROUTE (Fix) ⭐ */}
          <Route
            path="/gatepass-verify"
            element={
              <ProtectedRoute role="admin">
                <GatePassVerify />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
