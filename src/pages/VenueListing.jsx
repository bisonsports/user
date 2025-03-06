import React, { useState, useRef, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import Footer from '../components/Footer';
import VenueCards from '../components/VenueCards';
import { useLocation } from 'react-router-dom';
import './VenueListing.css';

const VenueListing = () => {
  const location = useLocation();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [availableSports, setAvailableSports] = useState([]);
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

  useEffect(() => {
    // Get available sports from cached data
    const cachedData = localStorage.getItem('venuesData');
    if (cachedData) {
      const { data } = JSON.parse(cachedData);
      const sports = [...new Set(data.map(venue => venue.sport.toLowerCase()))];
      setAvailableSports(sports);
      console.log('Available sports:', sports);
    }

    // Check if there's a selected sport from the home page
    if (location.state?.selectedSport) {
      const selectedSport = location.state.selectedSport.toLowerCase();
      console.log('Selected sport from home:', selectedSport);
      setSelectedFilters([selectedSport]);
    }
  }, [location.state]);

  const handleFilterChange = (filter) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

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
            value={searchText}
            onChange={handleSearch}
          />
          <button className="search-button">Search</button>
        </div>
        <div className="filter-dropdown" ref={filterRef}>
          <button 
            className="filter-button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FiFilter />
            {selectedFilters.length > 0 && (
              <span className="filter-count">{selectedFilters.length}</span>
            )}
          </button>
          {isFilterOpen && (
            <div className="filter-options">
              {availableSports.map((sport) => (
                <label key={sport} className="filter-checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectedFilters.includes(sport.toLowerCase())}
                    onChange={() => handleFilterChange(sport.toLowerCase())}
                  />
                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Venues List */}
      <VenueCards selectedFilters={selectedFilters} searchText={searchText} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default VenueListing; 