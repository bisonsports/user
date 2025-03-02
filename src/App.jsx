"use client"

import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import SportsCards from "./components/SportsCards"
import About from "./components/About"
import Testimonials from "./components/Testimonials"
import Footer from "./components/Footer"
import "./App.css"
import { db } from "./firebase"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore";

function App() {
  // console.log("Firestore Database Instance:", db);
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users")); // Get all docs in "users"
      
      // Extracting only name and age from documents
      const usersData = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        age: doc.data().age,
      }));

      console.log("All Users:", usersData); // Logs name & age of all users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);


  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
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
    <div className="app">
      <Navbar />
      <Hero />
      <SportsCards />
      <About />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default App

// import React, { useState } from "react";
// import { db } from "./firebase"; // Import Firestore instance
// import { collection, addDoc } from "firebase/firestore";

// function App() {
//   const [name, setName] = useState("");
//   const [age, setAge] = useState("");

//   // Function to add data to Firestore
//   const addUser = async () => {
//     if (!name || !age) {
//       alert("Please fill all fields!");
//       return;
//     }
//     try {
//       await addDoc(collection(db, "users"), {
//         name: name,
//         age: parseInt(age),
//       });
//       alert("User added successfully!");
//       setName("");
//       setAge("");
//     } catch (error) {
//       console.error("Error adding document: ", error);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Firestore - Add User</h1>
//       <input
//         type="text"
//         placeholder="Enter Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         style={{ marginRight: "10px", padding: "5px" }}
//       />
//       <input
//         type="number"
//         placeholder="Enter Age"
//         value={age}
//         onChange={(e) => setAge(e.target.value)}
//         style={{ marginRight: "10px", padding: "5px" }}
//       />
//       <button onClick={addUser} style={{ padding: "5px 10px", cursor: "pointer" }}>
//         Add User
//       </button>
//     </div>
//   );
// }

// export default App;
