import React, { useState, useRef, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import Footer from '../components/Footer';
import './VenueListing.css';

const VenueListing = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (filter) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const venues = [
    {
      id: 1,
      name: "Sports Arena",
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      amenities: ["Parking", "Changing Room", "Water"],
      price: "₹500",
      rating: 4.5
    },
    {
      id: 2,
      name: "Fitness Hub",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      amenities: ["Parking", "AC", "Equipment"],
      price: "₹800",
      rating: 4.8
    },
    {
      id: 3,
      name: "Sports Complex",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      amenities: ["Parking", "Cafeteria", "First Aid"],
      price: "₹1200",
      rating: 4.2
    },
    {
      id: 4,
      name: "Tennis Club",
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      amenities: ["Parking", "Equipment", "Coach"],
      price: "₹900",
      rating: 4.7
    },
    {
      id: 5,
      name: "Swimming Pool",
      image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      amenities: ["Parking", "Changing Room", "Locker"],
      price: "₹600",
      rating: 4.6
    },
    {
      id: 6,
      name: "Basketball Court",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      amenities: ["Parking", "Equipment", "Water"],
      price: "₹400",
      rating: 4.4
    }
  ];

  return (
    <div className="venue-listing-page">
      {/* Hero Section */}
      <div className="venue-hero">
        <h1><span className="typing-text">Let's get the best venue for you!</span></h1>
      </div>

      {/* Search and Filter Container */}
      <div className="search-filter-container">
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search venues..." 
            className="search-input"
          />
          <button className="search-button">Search</button>
        </div>
        <div className="filter-dropdown" ref={filterRef}>
          <button 
            className="filter-button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FiFilter />
            <span>Filters</span>
            {selectedFilters.length > 0 && (
              <span className="filter-count">{selectedFilters.length}</span>
            )}
          </button>
          {isFilterOpen && (
            <div className="filter-options">
              <label className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedFilters.includes('indoor')}
                  onChange={() => handleFilterChange('indoor')}
                />
                Indoor Venues
              </label>
              <label className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedFilters.includes('outdoor')}
                  onChange={() => handleFilterChange('outdoor')}
                />
                Outdoor Venues
              </label>
              <label className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedFilters.includes('parking')}
                  onChange={() => handleFilterChange('parking')}
                />
                Parking Available
              </label>
              <label className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedFilters.includes('equipment')}
                  onChange={() => handleFilterChange('equipment')}
                />
                Equipment Available
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Venues List */}
      <div className="venues-list">
        {venues.map(venue => (
          <div key={venue.id} className="venue-card">
            <div className="venue-image">
              <img src={venue.image} alt={venue.name} />
            </div>
            <div className="venue-details">
              <div className="venue-header">
                <h3>{venue.name}</h3>
                <span className="rating">★ {venue.rating}</span>
              </div>
              <div className="amenities">
                {venue.amenities.map((amenity, index) => (
                  <span key={index} className="amenity-tag">{amenity}</span>
                ))}
              </div>
              <div className="venue-footer">
                <span className="price">Starts from {venue.price}</span>
                <button className="book-now-btn">Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default VenueListing; 