"use client"

import { useState, useEffect } from "react"
import { Menu, X, User, Play, Calendar, Dumbbell } from "lucide-react"
import AuthModal from "./AuthModal"
import "./Navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

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
    setIsAuthModalOpen(true)
    setIsMenuOpen(false)
  }

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="container navbar-container">
          <div className="logo">
            <h1>PLAYO</h1>
            <span className="logo-dot"></span>
          </div>

          <div className={`menu-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </div>

          <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
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
                <User className="btn-icon" />
                <span>Login / Signup</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  )
}

export default Navbar

