"use client"

import { useState, useEffect } from "react"
import { Menu, X, User, Play, Calendar, Dumbbell, Heart, LogOut } from "lucide-react"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { Link } from "react-router-dom"
import { db } from "../firebase"
import AuthModal from "./AuthModal"
import ProfileDropdown from "./ProfileDropdown"
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
        const data = userDoc.data()
        setUserData({
          ...data,
          uid // Include the UID in userData
        })
        // Cache the user data in localStorage with 90 days expiry
        localStorage.setItem('userData', JSON.stringify({
          uid,
          ...data,
          lastFetched: new Date().getTime()
        }))
      } else {
        setUserData(null)
        localStorage.removeItem('userData')
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setUserData(null)
      localStorage.removeItem('userData')
    } finally {
      setUserDataLoading(false)
    }
  }

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (user) {
        // Check if we have cached data and if it's less than 90 days old
        const cachedData = localStorage.getItem('userData')
        if (cachedData) {
          try {
            const { lastFetched, uid, ...data } = JSON.parse(cachedData)
            const isExpired = Date.now() - lastFetched > 90 * 24 * 60 * 60 * 1000 // 90 days
            if (!isExpired && uid === user.uid) {
              setUserData({
                ...data,
                uid // Include the UID when setting from cache
              })
              setUserDataLoading(false)
            } else {
              fetchUserData(user.uid)
            }
          } catch (error) {
            console.error("Error parsing cached data:", error)
            localStorage.removeItem('userData')
            fetchUserData(user.uid)
          }
        } else {
          fetchUserData(user.uid)
        }
      } else {
        setUserData(null)
        localStorage.removeItem('userData')
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
      setUserData(null)
      localStorage.removeItem('userData')
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
          {user && userData && (
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
              ) : (
                `Welcome, ${userData.name}`
              )}
            </div>
          )}

          <div className={`menu-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </div>

          <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            {/* Mobile welcome message */}
            {user && userData && (
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
                ) : (
                  `Welcome, ${userData.name}`
                )}
              </div>
            )}

            <div className="nav-links">
              <Link to="/venues" className="nav-link">
                <Calendar className="nav-icon" />
                <span>Book</span>
              </Link>
              <Link to="/trainers" className="nav-link">
                <Dumbbell className="nav-icon" />
                <span>Train</span>
              </Link>
              <Link to="/rehabilitation" className="nav-link">
                <Heart className="nav-icon" />
                <span>Rehabilitation</span>
              </Link>
            </div>

            <div className="nav-buttons">
              {!user && (
                <button className="btn btn-secondary login-btn" onClick={handleAuthClick}>
                  <User className="btn-icon" />
                  <span>Login / Signup</span>
                </button>
              )}
              {user && userData && (
                <ProfileDropdown 
                  userData={userData} 
                  onLogout={handleLogout}
                />
              )}
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

