"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar"
import ScrollToTop from "./components/ScrollToTop"
import "./App.css"
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Home from './pages/Home';
import VenueListing from './pages/VenueListing';

function App() {
  const fetchUserData = async () => {
    try {
      // Get user data from localStorage
      const cachedUserData = JSON.parse(localStorage.getItem('userData'));
      if (!cachedUserData || !cachedUserData.uid) return;

      // Query users collection for the logged-in user
      const usersQuery = query(
        collection(db, "users"),
        where("uid", "==", cachedUserData.uid)
      );
      
      const querySnapshot = await getDocs(usersQuery);
      const userData = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        age: doc.data().age,
      }));
      
      console.log("All Users:", userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="logo-container">
          <h1 className="logo-text">SPORTZ</h1>
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <Router basename="/">
      <div className="App">
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venues" element={<VenueListing />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
