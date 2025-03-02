"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, ArrowRight } from "lucide-react"
import "./Hero.css"

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchValue, setSearchValue] = useState("")
  const [isTextVisible, setIsTextVisible] = useState(true)

  const slides = [
    {
      id: 1,
      image: "/placeholder.svg?height=600&width=800",
      title: "DISCOVER VENUES",
      subtitle: "Book the best facilities",
      description: "Find and book premium sports facilities in your area",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=600&width=800",
      title: "CONNECT WITH PLAYERS",
      subtitle: "Join the community",
      description: "Meet sports enthusiasts and join exciting games",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=600&width=800",
      title: "TRAIN WITH EXPERTS",
      subtitle: "Level up your game",
      description: "Get coached by professional trainers and improve your skills",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTextVisible(false)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
        setIsTextVisible(true)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchValue)
  }

  return (
    <section className="hero">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
          </div>
        ))}
      </div>

      <div className="hero-content">
        <div className="container">
          <div className={`text-content ${isTextVisible ? "visible" : ""}`}>
            <h1 className="hero-title">{slides[currentSlide].title}</h1>
            <h2 className="hero-subtitle">{slides[currentSlide].subtitle}</h2>
            <p className="hero-description">{slides[currentSlide].description}</p>
          </div>

          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-container">
              <MapPin className="search-icon" />
              <input
                type="text"
                placeholder="Enter your location"
                value={searchValue}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-button">
              <Search className="search-button-icon" />
              <span>Search</span>
            </button>
          </form>

          <button className="explore-button">
            <span>Explore Now</span>
            <ArrowRight className="explore-icon" />
          </button>

          <div className="slider-indicators">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`indicator ${index === currentSlide ? "active" : ""}`}
                onClick={() => {
                  setIsTextVisible(false)
                  setTimeout(() => {
                    setCurrentSlide(index)
                    setIsTextVisible(true)
                  }, 500)
                }}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

