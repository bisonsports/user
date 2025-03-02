"use client"

import { useRef, useState, useEffect } from "react"
import { FiCheckCircle } from "react-icons/fi"
import "./About.css"

const About = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const features = [
    {
      id: 1,
      title: "Find Sports Venues",
      description: "Discover the best sports venues near you with real-time availability.",
      icon: <FiCheckCircle />,
    },
    {
      id: 2,
      title: "Connect with Players",
      description: "Join games or find teammates who share your passion for sports.",
      icon: <FiCheckCircle />,
    },
    {
      id: 3,
      title: "Book Instantly",
      description: "Secure your spot with our easy booking system and instant confirmations.",
      icon: <FiCheckCircle />,
    },
    {
      id: 4,
      title: "Train with Experts",
      description: "Improve your skills with professional coaches and training programs.",
      icon: <FiCheckCircle />,
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
    <section className="about" ref={sectionRef}>
      <div className="container">
        <h2 className={`section-title ${isVisible ? "visible" : ""}`}>How SPORTZ Works</h2>

        <div className="about-content">
          <div className={`about-image ${isVisible ? "visible" : ""}`}>
            <img src="/placeholder.svg?height=500&width=600" alt="About SPORTZ" />
          </div>

          <div className="about-features">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`feature-item ${isVisible ? "visible" : ""}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-text">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

