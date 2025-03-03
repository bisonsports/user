"use client"

import { useState, useEffect } from "react"
import { Menu, X, User, Play, Calendar, Dumbbell, LogOut } from "lucide-react"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { Link } from "react-router-dom"
import { db } from "../firebase"
import AuthModal from "./AuthModal"
import "./Navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userDataLoading, setUserDataLoading] = useState(false)

  const fetchUserData = async (uid) => {
    try {
      setUserDataLoading(true)
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        setUserData(userDoc.data())
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setUserDataLoading(false)
    }
  }

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (user) {
        fetchUserData(user.uid)
      } else {
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleAuthClick = () => {
    if (user) {
      handleLogout()
    } else {
      setIsAuthModalOpen(true)
      setIsMenuOpen(false)
    }
  }

  const handleLogout = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      setIsMenuOpen(false)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleAuthSuccess = (user) => {
    setUser(user)
    fetchUserData(user.uid)
  }

  if (loading) {
    return null // Or a loading spinner
  }

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="container navbar-container">
          <Link to="/" className="logo">
            <h1>PLAYO</h1>
            <span className="logo-dot"></span>
          </Link>

          {/* Desktop welcome message */}
          {user && (
            <div className="welcome-message desktop-only">
              {userDataLoading ? (
                <div className="welcome-loading">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>Loading...</span>
                </div>
              ) : userData ? (
                `Welcome, ${userData.name}`
              ) : null}
            </div>
          )}

          <div className={`menu-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </div>

          <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            {/* Mobile welcome message */}
            {user && (
              <div className="welcome-message mobile-only">
                {userDataLoading ? (
                  <div className="welcome-loading">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>Loading...</span>
                  </div>
                ) : userData ? (
                  `Welcome, ${userData.name}`
                ) : null}
              </div>
            )}

            <div className="nav-links">
              <a href="#" className="nav-link">
                <Play className="nav-icon" />
                <span>Play</span>
              </a>
              <a href="#" className="nav-link">
                <Calendar className="nav-icon" />
                <span>Book</span>
              </a>
              <a href="#" className="nav-link">
                <Dumbbell className="nav-icon" />
                <span>Train</span>
              </a>
            </div>

            <div className="nav-buttons">
              <button className="btn btn-secondary login-btn" onClick={handleAuthClick}>
                {user ? (
                  <>
                    <LogOut className="btn-icon" />
                    <span>Logout</span>
                  </>
                ) : (
                  <>
                    <User className="btn-icon" />
                    <span>Login / Signup</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
}

export default Navbar

