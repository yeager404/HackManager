import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Navbar from "./components/navbar";
import HeroSection from "./components/HeroSection";
import Features from "./components/Features";
import Workflow from "./components/Workflow";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Login from "./components/Login";
import LoginPanelist from "./components/LoginPanelist";
import Dashboard from "./components/Dashboard";
import useAuthStore from "./store/authStore.js";
import SignupPage from "./components/signup.jsx";
import HackathonPage from "./components/HackathonPages/HackathonPage.jsx";
import PanelDashboard from "./components/PanelDashboard";

const App = () => {
  const { isAuthenticated, role } = useAuthStore();

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={ 
          <div>
            <Navbar />
            <div className="w-full mx-auto pt-20 px-6">
              <HeroSection />
            </div>
            <section id="features">
              <Features />
            </section>
            <section id="workflow">
              <Workflow />
            </section>
            <section id="testimonials">
              <Testimonials />
            </section>
            <Footer />
          </div>
        } />
        
        {/* Only show login routes when NOT authenticated */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/panelist-login" 
          element={!isAuthenticated ? <LoginPanelist /> : <Navigate to="/panel-dashboard" />} 
        />
        
        {/* Protect dashboard routes based on role */}
        <Route 
          path="/dashboard" 
          element={(isAuthenticated && role === "creator") ? <Dashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/panel/:panelistId" 
          element={(isAuthenticated && role === "panelist") ? <PanelDashboard /> : <Navigate to="/panelist-login" />} 
        />  
        
        <Route 
          path="/signup" 
          element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/hackathon/:hackathonId" 
          element={(isAuthenticated && role === "creator") ? <HackathonPage /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;