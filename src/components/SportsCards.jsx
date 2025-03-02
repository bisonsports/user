"use client"

import { useState, useEffect, useRef } from "react"
import { FiArrowRight, FiStar } from "react-icons/fi"
import { IoFootball, IoBasketball, IoTennisball, IoGolf, IoBicycle, IoAmericanFootball } from "react-icons/io5"
import "./SportsCards.css"

const SportsCards = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const sportsCards = [
    {
      id: 1,
      title: "Football",
      icon: <IoFootball />,
      image: "/placeholder.svg?height=300&width=400",
      rating: 4.8,
      price: "$15/hr",
      featured: true,
    },
    {
      id: 2,
      title: "Basketball",
      icon: <IoBasketball />,
      image: "/placeholder.svg?height=300&width=400",
      rating: 4.6,
      price: "$12/hr",
      featured: false,
    },
    {
      id: 3,
      title: "Tennis",
      icon: <IoTennisball />,
      image: "/placeholder.svg?height=300&width=400",
      rating: 4.9,
      price: "$20/hr",
      featured: true,
    },
    {
      id: 4,
      title: "Golf",
      icon: <IoGolf />,
      image: "/placeholder.svg?height=300&width=400",
      rating: 4.7,
      price: "$25/hr",
      featured: false,
    },
    {
      id: 5,
      title: "Cycling",
      icon: <IoBicycle />,
      image: "/placeholder.svg?height=300&width=400",
      rating: 4.5,
      price: "$10/hr",
      featured: false,
    },
    {
      id: 6,
      title: "Rugby",
      icon: <IoAmericanFootball />,
      image: "/placeholder.svg?height=300&width=400",
      rating: 4.4,
      price: "$18/hr",
      featured: true,
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1,
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section className="sports-cards" ref={sectionRef}>
      <div className="container">
        <div className={`section-header ${isVisible ? "visible" : ""}`}>
          <h2 className="section-title">Book Venues</h2>
          <a href="#" className="view-all">
            <span>See All Venues</span>
            <FiArrowRight />
          </a>
        </div>

        <div className="cards-container">
          {sportsCards.map((card, index) => (
            <div
              key={card.id}
              className={`card ${isVisible ? "visible" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-image">
                <img src={card.image || "/placeholder.svg"} alt={card.title} />
                {card.featured && <span className="featured-badge">FEATURED</span>}
              </div>
              <div className="card-content">
                <div className="card-icon">{card.icon}</div>
                <h3 className="card-title">{card.title}</h3>
                <div className="card-details">
                  <div className="card-rating">
                    <FiStar />
                    <span>{card.rating}</span>
                  </div>
                  <div className="card-price">{card.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`cta-button ${isVisible ? "visible" : ""}`}>
          <button className="btn btn-primary">
            <span>Explore All Sports</span>
            <FiArrowRight />
          </button>
        </div>
      </div>
    </section>
  )
}

export default SportsCards

