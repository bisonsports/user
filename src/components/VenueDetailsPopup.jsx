import React, { useState, useEffect } from 'react';
import { FiX, FiClock, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { IoFootball, IoBasketball, IoTennisball, IoGolf, IoBicycle, IoAmericanFootball, IoBaseball, IoFitness } from 'react-icons/io5';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import UserBookingModal from './UserBookingModal';
import './VenueDetailsPopup.css';

const VenueDetailsPopup = ({ venue, onClose }) => {
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const getSportIcon = (sport) => {
    switch (sport.toLowerCase()) {
      case 'football':
        return IoFootball;
      case 'basketball':
        return IoBasketball;
      case 'tennis':
        return IoTennisball;
      case 'golf':
        return IoGolf;
      case 'cycling':
        return IoBicycle;
      case 'rugby':
        return IoAmericanFootball;
      case 'badminton':
        return IoTennisball;
      case 'cricket':
        return IoBaseball;
      case 'fitness':
        return IoFitness;
      default:
        return IoFitness;
    }
  };

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        if (!venue || !venue.stadiumId || !venue.sport) {
          setLoading(false);
          return;
        }

        // Query courts collection where stadiumId matches
        const courtsQuery = query(
          collection(db, 'courts'),
          where('stadiumId', '==', venue.stadiumId)
        );
        
        const courtsSnapshot = await getDocs(courtsQuery);
        const courtsData = courtsSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(court => court.sport.toLowerCase() === venue.sport.toLowerCase());
        
        setCourts(courtsData);
        if (courtsData.length > 0) {
          setSelectedCourt(courtsData[0]);
        }
      } catch (error) {
        console.error("Error fetching courts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, [venue]);

  const SportIcon = getSportIcon(venue.sport);

  const handleBookNowClick = () => {
    if (!selectedCourt) {
      // If no court is selected, select the first one
      setSelectedCourt(courts[0]);
    }
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="popup-overlay">
        <div className="popup-content venue-details-popup">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading court details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>
        
        <div className="venue-details-header">
          <div className="venue-icon">
            <SportIcon />
          </div>
          <div className="venue-title-section">
            <h2>{venue.title}</h2>
            <span className="sport-badge">{venue.sport.charAt(0).toUpperCase() + venue.sport.slice(1)}</span>
          </div>
        </div>

        <div className="venue-details-body">
          <div className="amenities-section">
            <h3>Amenities</h3>
            <div className="amenities">
              {venue.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">{amenity}</span>
              ))}
            </div>
          </div>

          {courts.length > 0 ? (
            <>
              <div className="courts-section">
                <h3>Available Courts</h3>
                <div className="courts-grid">
                  {courts.map(court => (
                    <button
                      key={court.id}
                      className={`court-button ${selectedCourt?.id === court.id ? 'selected' : ''}`}
                      onClick={() => setSelectedCourt(court)}
                    >
                      Court {court.courtNumber}
                    </button>
                  ))}
                </div>
              </div>

              {selectedCourt && (
                <div className="court-details">
                  <h3>Court Details</h3>
                  <div className="court-info-grid">
                    <div className="info-item">
                      <span className="label">Court Type</span>
                      <span className="value">{selectedCourt.courtType}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Price per Hour</span>
                      <span className="value">₹{selectedCourt.pricePerHour}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Minimum Duration</span>
                      <span className="value">{selectedCourt.minimumBookingDuration} minutes</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Opening Time</span>
                      <span className="value">{selectedCourt.openingTime}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Closing Time</span>
                      <span className="value">{selectedCourt.closingTime}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-courts-message">
              <p>No courts available for this venue.</p>
            </div>
          )}

          <div className="venue-footer">
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
              className="book-now-btn"
              onClick={handleBookNowClick}
              disabled={courts.length === 0}
            >
              Book Now
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>

      {showBookingModal && selectedCourt && (
        <UserBookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          court={selectedCourt}
          venue={venue}
        />
      )}
    </div>
  );
};

export default VenueDetailsPopup; 