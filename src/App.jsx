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
import { collection, addDoc , getDocs } from "firebase/firestore";

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




// import React, { useState, useEffect } from "react";
// import { db } from "./firebase"; // Ensure Firebase is properly configured
// import { collection, addDoc, doc, getDocs, setDoc } from "firebase/firestore";

// const App = () => {
//   const [stadiums, setStadiums] = useState([]);
//   const [courts, setCourts] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [coaches, setCoaches] = useState([]);

//   const [formData, setFormData] = useState({
//     userName: "",
//     userEmail: "",
//     userPhone: "",
//     stadiumName: "",
//     stadiumAddress: "",
//     stadiumAmenities: "",
//     selectedStadium: "",
//     courtNumber: "",
//     courtPrice: "",
//     selectedCourt: "",
//     coachName: "",
//     coachExperience: "",
//     coachPrice: "",
//     selectedCoach: "",
//     bookingDate: "",
//     bookingTimeSlot: "",
//     selectedUser: "",
//     transactionAmount: "",
//     transactionMethod: "",
//     transactionStatus: "",
//     teamName: "",
//     teamOwner: "",
//     managerName: "",
//     managerEmail: "",
//     managerPassword: "",
//     assignedStadium: "",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       const stadiumSnapshot = await getDocs(collection(db, "stadiums"));
//       setStadiums(stadiumSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

//       const courtSnapshot = await getDocs(collection(db, "stadiums"));
//       setCourts(courtSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

//       const userSnapshot = await getDocs(collection(db, "users"));
//       setUsers(userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

//       const coachSnapshot = await getDocs(collection(db, "coaches"));
//       setCoaches(coachSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     };

//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (collectionName, data, docId = null) => {
//     try {
//       if (docId) {
//         await setDoc(doc(db, collectionName, docId), data);
//       } else {
//         await addDoc(collection(db, collectionName), data);
//       }
//       alert(`Added to ${collectionName} successfully!`);
//     } catch (error) {
//       console.error(`Error adding to ${collectionName}:`, error);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Add Data to Firestore</h2>

//       {/* User Form */}
//       <h3>Add User</h3>
//       <input name="userName" placeholder="Name" onChange={handleChange} />
//       <input name="userEmail" placeholder="Email" onChange={handleChange} />
//       <input name="userPhone" placeholder="Phone" onChange={handleChange} />
//       <button onClick={() => handleSubmit("users", { 
//         name: formData.userName, email: formData.userEmail, phone: formData.userPhone 
//       })}>
//         Add User
//       </button>

//       {/* Stadium Form */}
//       <h3>Add Stadium</h3>
//       <input name="stadiumName" placeholder="Stadium Name" onChange={handleChange} />
//       <input name="stadiumAddress" placeholder="Stadium Address" onChange={handleChange} />
//       <input name="stadiumAmenities" placeholder="Amenities (comma separated)" onChange={handleChange} />
//       <button onClick={() => handleSubmit("stadiums", { 
//         name: formData.stadiumName, address: formData.stadiumAddress, amenities: formData.stadiumAmenities.split(",") 
//       })}>
//         Add Stadium
//       </button>

//       {/* Court Form */}
//       <h3>Add Court</h3>
//       <select name="selectedStadium" onChange={handleChange}>
//         <option value="">Select Stadium</option>
//         {stadiums.map((stadium) => (
//           <option key={stadium.id} value={stadium.id}>{stadium.name}</option>
//         ))}
//       </select>
//       <input name="courtNumber" placeholder="Court Number" onChange={handleChange} />
//       <input name="courtPrice" placeholder="Price Per Hour" onChange={handleChange} />
//       <button onClick={() => handleSubmit(`stadiums/${formData.selectedStadium}/courts`, { 
//         courtNumber: formData.courtNumber, pricePerHour: formData.courtPrice 
//       })}>
//         Add Court
//       </button>

//       {/* Booking Form */}
//       <h3>Add Booking</h3>
//       <select name="selectedUser" onChange={handleChange}>
//         <option value="">Select User</option>
//         {users.map((user) => (
//           <option key={user.id} value={user.id}>{user.name}</option>
//         ))}
//       </select>
//       <select name="selectedCourt" onChange={handleChange}>
//         <option value="">Select Court</option>
//         {courts.map((court) => (
//           <option key={court.id} value={court.id}>{court.courtNumber}</option>
//         ))}
//       </select>
//       <input name="bookingDate" type="date" onChange={handleChange} />
//       <input name="bookingTimeSlot" placeholder="Time Slot" onChange={handleChange} />
//       <button onClick={() => handleSubmit(`users/${formData.selectedUser}/bookingHistory`, { 
//         stadiumId: formData.selectedStadium, courtId: formData.selectedCourt, date: formData.bookingDate, timeSlot: formData.bookingTimeSlot, status: "confirmed" 
//       })}>
//         Add Booking
//       </button>

//       {/* Manager Form */}
//       <h3>Add Manager</h3>
//       <input name="managerName" placeholder="Manager Name" onChange={handleChange} />
//       <input name="managerEmail" placeholder="Manager Email" onChange={handleChange} />
//       <input name="managerPassword" placeholder="Manager Password" onChange={handleChange} />
//       <select name="assignedStadium" onChange={handleChange}>
//         <option value="">Assign to Stadium</option>
//         {stadiums.map((stadium) => (
//           <option key={stadium.id} value={stadium.id}>{stadium.name}</option>
//         ))}
//       </select>
//       <button onClick={() => handleSubmit("managers", { 
//         name: formData.managerName, email: formData.managerEmail, password: formData.managerPassword, stadiumId: formData.assignedStadium 
//       })}>
//         Add Manager
//       </button>

//       {/* Transactions Form */}
//       <h3>Add Transaction</h3>
//       <input name="transactionAmount" placeholder="Amount" onChange={handleChange} />
//       <input name="transactionMethod" placeholder="Payment Method" onChange={handleChange} />
//       <input name="transactionStatus" placeholder="Status" onChange={handleChange} />
//       <button onClick={() => handleSubmit("transactions", { 
//         amount: formData.transactionAmount, paymentMethod: formData.transactionMethod, status: formData.transactionStatus 
//       })}>
//         Add Transaction
//       </button>
//     </div>
//   );
// };

// export default App;
