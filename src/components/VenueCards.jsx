"use client"

import { useState, useEffect } from "react"
import { FiArrowRight, FiStar, FiMapPin, FiClock } from "react-icons/fi"
import { 
  IoFootball, 
  IoBasketball, 
  IoTennisball, 
  IoGolf, 
  IoBicycle, 
  IoAmericanFootball,
  IoBaseball,
  IoFitness
} from "react-icons/io5"
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { Link } from 'react-router-dom'
import VenueDetailsPopup from './VenueDetailsPopup'
import "./VenueCards.css"

const VenueCards = ({ selectedFilters = [], searchText = '' }) => {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVenue, setSelectedVenue] = useState(null)

  const getSportIcon = (sport) => {
    switch (sport.toLowerCase()) {
      case 'football':
        return IoFootball
      case 'basketball':
        return IoBasketball
      case 'tennis':
        return IoTennisball
      case 'golf':
        return IoGolf
      case 'cycling':
        return IoBicycle
      case 'rugby':
        return IoAmericanFootball
      case 'badminton':
        return IoTennisball
      case 'cricket':
        return IoBaseball
      case 'fitness':
        return IoFitness
      default:
        return IoFitness
    }
  }

  const handleViewDetails = (venue) => {
    console.log('Opening details for venue:', venue);
    setSelectedVenue(venue);
  };

  const fetchCourtsAndStadiums = async () => {
    try {
      // Check if we have cached data and if it's less than 5 minutes old
      const cachedData = localStorage.getItem('venuesData')
      if (cachedData) {
        const { lastFetched, data } = JSON.parse(cachedData)
        const isExpired = Date.now() - lastFetched > 5 * 60 * 1000 // 5 minutes
        if (!isExpired) {
          console.log('Using cached venues data:', data);
          setVenues(data)
          setLoading(false)
          return
        }
      }

      // Fetch courts data
      const courtsSnapshot = await getDocs(collection(db, 'courts'))
      
      // Group courts by stadium and sport
      const courtsByStadium = {}
      
      for (const courtDoc of courtsSnapshot.docs) {
        const courtData = courtDoc.data()
        console.log('Processing court data:', courtData);
        const key = `${courtData.stadiumId}-${courtData.sport.toLowerCase()}`
        
        if (!courtsByStadium[key]) {
          // Fetch stadium data only once per stadium
          const stadiumDoc = await getDoc(doc(db, 'stadiums', courtData.stadiumId))
          const stadiumData = stadiumDoc.data()
          
          courtsByStadium[key] = {
            id: courtDoc.id,
            stadiumId: courtData.stadiumId,
            title: stadiumData.name,
            sport: courtData.sport.toLowerCase(),
            amenities: [courtData.sport, ...stadiumData.amenities],
            address: stadiumData.address,
            addressLink: stadiumData.addressLink,
            prices: [courtData.pricePerHour]
          }
        } else {
          // Add price to existing stadium-sport group
          courtsByStadium[key].prices.push(courtData.pricePerHour)
        }
      }

      // Convert grouped data to array and calculate prices
      const venuesData = Object.values(courtsByStadium).map(venue => {
        const singlePrice = venue.prices[0];
        const priceDisplay = venue.prices.length === 1 
          ? `₹${singlePrice}/hr`
          : `₹${Math.min(...venue.prices)} - ₹${Math.max(...venue.prices)}/hr`;
        
        return {
          ...venue,
          price: priceDisplay,
          courtCount: venue.prices.length,
          isSingleCourt: venue.prices.length === 1
        };
      });

      console.log('Final venues data:', venuesData);

      // Cache the data
      localStorage.setItem('venuesData', JSON.stringify({
        data: venuesData,
        lastFetched: Date.now()
      }))

      setVenues(venuesData)
    } catch (error) {
      console.error("Error fetching venues data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourtsAndStadiums()
  }, [])

  // Filter venues based on selected filters and search text
  const filteredVenues = venues.filter(venue => {
    const matchesFilter = selectedFilters.length === 0 || 
      selectedFilters.some(filter => venue.sport.toLowerCase() === filter.toLowerCase());
    const matchesSearch = searchText === '' || 
      venue.title.toLowerCase().includes(searchText.toLowerCase()) ||
      venue.sport.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  console.log('Filtered venues:', filteredVenues);
  console.log('Selected filters:', selectedFilters);

  const handleClosePopup = () => {
    setSelectedVenue(null);
  };

  if (loading) {
    return (
      <div className="venues-list">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading venues...</p>
        </div>
      </div>
    )
  }

  if (filteredVenues.length === 0) {
    return (
      <div className="venues-list">
        <div className="no-results">
          <p>No venues found matching your criteria.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="venues-list">
        {filteredVenues.map(venue => {
          const SportIcon = getSportIcon(venue.sport);
          return (
            <div key={venue.id} className="venue-card">
              <div className="venue-image">
                <img src="/placeholder.svg?height=300&width=400" alt={venue.title} />
                <div className="venue-overlay">
                  <span className="sport-badge">{venue.sport.charAt(0).toUpperCase() + venue.sport.slice(1)}</span>
                </div>
              </div>
              <div className="venue-details">
                <div className="venue-header">
                  <div className="venue-icon">
                    <SportIcon />
                  </div>
                  <div className="venue-title-section">
                    <h3>{venue.title}</h3>
                    <span className="court-count">{venue.courtCount} {venue.sport.charAt(0).toUpperCase() + venue.sport.slice(1)} {venue.courtCount > 1 ? 'Courts' : 'Court'}</span>
                  </div>
                </div>
                <div className="amenities">
                  {venue.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-tag">{amenity}</span>
                  ))}
                </div>
                <div className="venue-footer">
                  <div className="price-section">
                    <FiClock className="price-icon" />
                    <span className="price-label">
                      {venue.isSingleCourt ? 'Price:' : 'Price Range:'}
                    </span>
                    <span className="price">{venue.price}</span>
                  </div>
                  <div className="address-section">
                    <FiMapPin className="map-icon" />
                    <a 
                      href={venue.addressLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="address-link"
                    >
                      {venue.address}
                    </a>
                  </div>
                  <button 
                    onClick={() => handleViewDetails(venue)}
                    className="view-details-btn"
                  >
                    View Details
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedVenue && (
        <VenueDetailsPopup
          venue={selectedVenue}
          onClose={handleClosePopup}
        />
      )}
    </>
  )
}

export default VenueCards 