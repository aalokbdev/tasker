import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './compoenents/Navbar/Navbar.tsx';
import TaskDashboard from './pages/TaskDashboard/TaskDashboard.tsx';
import Login from './pages/Auth/Login.tsx';
import Signup from './pages/Auth/SignUp.tsx';
import PrivateRoute from './compoenents/PrivateRoute.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route
              path="/user"
              element={
                <PrivateRoute role="User">
                  <TaskDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute role="Admin">
                  <TaskDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
