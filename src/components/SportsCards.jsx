"use client"

import { useState, useEffect, useRef } from "react"
import { FiArrowRight, FiStar } from "react-icons/fi"
import { IoFootball, IoBasketball, IoTennisball, IoGolf, IoBicycle, IoAmericanFootball, IoBaseball, IoFitness } from "react-icons/io5"
import { Link, useNavigate } from 'react-router-dom'
import "./SportsCards.css"

const SportsCards = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const navigate = useNavigate()

  const sportsCards = [
    {
      id: 1,
      title: "Football",
      icon: <IoFootball />,
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      rating: 4.8,
      price: "₹500/hr",
      featured: true,
      sport: "football"
    },
    {
      id: 2,
      title: "Basketball",
      icon: <IoBasketball />,
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      rating: 4.6,
      price: "₹400/hr",
      featured: false,
      sport: "basketball"
    },
    {
      id: 3,
      title: "Tennis",
      icon: <IoTennisball />,
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      rating: 4.9,
      price: "₹600/hr",
      featured: true,
      sport: "tennis"
    },
    {
      id: 4,
      title: "Badminton",
      icon: <IoTennisball />,
      image: "https://images.unsplash.com/photo-1613918431703-aa508cbffb03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      rating: 4.7,
      price: "₹300/hr",
      featured: false,
      sport: "badminton"
    },
    {
      id: 5,
      title: "Cricket",
      icon: <IoBaseball />,
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      rating: 4.8,
      price: "₹800/hr",
      featured: true,
      sport: "cricket"
    },
    {
      id: 6,
      title: "Fitness",
      icon: <IoFitness />,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      rating: 4.5,
      price: "₹200/hr",
      featured: false,
      sport: "fitness"
    }
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

  const handleSportClick = (sport) => {
    navigate('/venues', { state: { selectedSport: sport } });
  };

  return (
    <section className="sports-cards" ref={sectionRef}>
      <div className="container">
        <div className={`section-header ${isVisible ? "visible" : ""}`}>
          <h2 className="section-title">Book Venues</h2>
          <Link to="/venues" className="view-all">
            <span>See All Venues</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="cards-container">
          {sportsCards.map((card, index) => (
            <div
              key={card.id}
              className={`card ${isVisible ? "visible" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleSportClick(card.sport)}
            >
              <div className="card-image">
                <img src={card.image} alt={card.title} />
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

