"use client"

import { useState, useEffect, useRef } from "react"
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi"
import "./Testimonials.css"

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const testimonials = [
    {
      id: 1,
      name: "John Smith",
      role: "Football Enthusiast",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "SPORTZ has completely changed how I find places to play. The app is intuitive, and I've met so many great players through the platform!",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Tennis Player",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "Booking tennis courts used to be such a hassle. Now with SPORTZ, I can find and book courts in seconds. Absolutely love it!",
    },
    {
      id: 3,
      name: "Michael Brown",
      role: "Basketball Coach",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4,
      text: "As a coach, I need reliable venues for my training sessions. SPORTZ has made it so easy to find and book courts for my team practices.",
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  return (
    <section className="testimonials" ref={sectionRef}>
      <div className="container">
        <h2 className={`section-title ${isVisible ? "visible" : ""}`}>What Our Users Say</h2>

        <div className={`testimonials-slider ${isVisible ? "visible" : ""}`}>
          <button className="slider-arrow prev" onClick={prevSlide}>
            <FiChevronLeft />
          </button>

          <div className="testimonials-container">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className={`testimonial-card ${index === currentSlide ? "active" : ""}`}>
                <div className="testimonial-content">
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={i < testimonial.rating ? "filled" : ""} />
                    ))}
                  </div>
                  <p className="testimonial-text">{testimonial.text}</p>
                </div>

                <div className="testimonial-author">
                  <div className="author-image">
                    <img src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="slider-arrow next" onClick={nextSlide}>
            <FiChevronRight />
          </button>
        </div>

        <div className="testimonial-indicators">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

