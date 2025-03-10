import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './UserBookingModal.css';
import { FiX, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AuthModal from './AuthModal';

const UserBookingModal = ({ isOpen, onClose, court, venue }) => {
  const [formData, setFormData] = useState({
    date: '',
    duration: court?.minimumBookingDuration || 60,
    timeSlot: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const slotsGridRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        date: today,
        duration: court.minimumBookingDuration || 60,
      });
      setError('');
      setSelectedSlot(null);
      setShowSuccessMessage(false);
    }
  }, [isOpen, court]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Stop event propagation to prevent parent modal from closing
      event.stopPropagation();
      
      // Don't close if auth modal is open
      if (!showAuthModal && modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, showAuthModal]);

  const fetchBookedSlots = async () => {
    if (!formData.date || !court.id) return;

    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('courtId', '==', court.id),
        where('date', '==', formData.date)
      );
      const querySnapshot = await getDocs(q);
      
      const bookedSlotsData = querySnapshot.docs.map(doc => ({
        ...doc.data()
      }));
      
      setBookedSlots(bookedSlotsData);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

  useEffect(() => {
    if (formData.date && court.id) {
      fetchBookedSlots();
    }
  }, [formData.date, court.id]);

  const convertTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    hours = hours % 12;
    if (period === 'PM') hours += 12;
    return hours * 60 + minutes;
  };

  const isTimeSlotAvailable = (startTime, endTime) => {
    if (!startTime || !endTime) return false;
    
    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = convertTimeToMinutes(endTime);

    return !bookedSlots.some(booking => {
      const bookingStart = convertTimeToMinutes(booking.timeSlot.startTime);
      const bookingEnd = convertTimeToMinutes(booking.timeSlot.endTime);
      return (startMinutes < bookingEnd && endMinutes > bookingStart);
    });
  };

  const isSlotInPast = (startTime) => {
    if (!startTime) return true;
    
    // Get current time in IST
    const now = new Date();
    const currentIST = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    // Parse the slot time
    const [time, period] = startTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    hours = hours % 12;
    if (period === 'PM') hours += 12;

    // Create slot time using the selected date
    const slotTime = new Date(formData.date);
    slotTime.setHours(hours, minutes, 0);

    // If the slot is for today
    if (slotTime.toDateString() === currentIST.toDateString()) {
        // Allow slots that are within the next 30 minutes from current time
        const thirtyMinutesFromNow = new Date(currentIST.getTime() + 30 * 60 * 1000);
        return slotTime < currentIST && slotTime < thirtyMinutesFromNow;
    }

    // For future dates, only check if the slot is in the past
    return slotTime < currentIST;
  };

  const generateAvailableSlots = () => {
    if (!court?.openingTime || !court?.closingTime || !formData.date || !formData.duration) {
      setAvailableSlots([]);
      return;
    }

    try {
      const slots = [];
      const [openingTime, openingPeriod] = court.openingTime.split(' ');
      let [openingHour, openingMinute] = openingTime.split(':').map(Number);
      openingHour = openingHour % 12;
      if (openingPeriod === 'PM') openingHour += 12;

      const [closingTime, closingPeriod] = court.closingTime.split(' ');
      let [closingHour, closingMinute] = closingTime.split(':').map(Number);
      closingHour = closingHour % 12;
      if (closingPeriod === 'PM') closingHour += 12;
      
      // Create dates in IST
      let currentTime = new Date(formData.date);
      currentTime.setHours(openingHour, openingMinute, 0);
      
      const closingTimeDate = new Date(formData.date);
      closingTimeDate.setHours(closingHour, closingMinute, 0);
      
      while (currentTime < closingTimeDate) {
        const startTime = currentTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata'
        });
        
        const endTime = new Date(currentTime);
        endTime.setMinutes(currentTime.getMinutes() + formData.duration);
        
        if (endTime <= closingTimeDate) {
          const endTimeStr = endTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata'
          });
          
          if (isTimeSlotAvailable(startTime, endTimeStr) && !isSlotInPast(startTime)) {
            slots.push({ startTime, endTime: endTimeStr });
          }
        }
        
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
      
      setAvailableSlots(slots);
    } catch (error) {
      setError('Error generating time slots. Please try again.');
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
    generateAvailableSlots();
  }, [formData.date, formData.duration, court, bookedSlots]);

  const calculatePrice = () => {
    if (!court || !formData.duration) return 0;
    const durationInHours = formData.duration / 60;
    return Math.round(durationInHours * court.pricePerHour);
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.uid) {
      setShowAuthModal(true);
      return;
    }

    setShowPaymentConfirmation(true);
  };

  const handleAuthSuccess = (user) => {
    setShowAuthModal(false);
    // Store the user data in localStorage if not already stored
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || userData.uid !== user.uid) {
      localStorage.setItem('userData', JSON.stringify({
        uid: user.uid,
        email: user.email,
        lastFetched: new Date().getTime()
      }));
    }
    setShowPaymentConfirmation(true);
  };

  const handleCancelPayment = () => {
    setShowPaymentConfirmation(false);
  };

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.uid) {
        setError('Please login to book a court');
        return;
      }

      const bookingData = {
        userId: userData.uid,
        courtId: court.id,
        stadiumId: venue.stadiumId,
        date: formData.date,
        timeSlot: selectedSlot,
        amount: calculatePrice(),
        status: "confirmed",
        coachId: null,
        createdAt: Date.now()
      };

      // Generate a unique ID for the booking
      const bookingId = `${userData.uid}_${Date.now()}`;
      const bookingRef = doc(collection(db, 'bookings'), bookingId);
      await setDoc(bookingRef, bookingData);

      setShowSuccessMessage(true);
      setTimeout(() => {
        onClose();
        if (window.refreshProfileBookings) {
          window.refreshProfileBookings();
        }
      }, 1000);
    } catch (error) {
      console.error('Error confirming payment:', error);
      setError('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScrollLeft = () => {
    if (slotsGridRef.current) {
      slotsGridRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (slotsGridRef.current) {
      slotsGridRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="booking-modal" ref={modalRef}>
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>

        <div className="modal-header">
          <h2>Book {venue.title}</h2>
          <p>Court {court.courtNumber} - {court.courtType}</p>
        </div>

        {showSuccessMessage ? (
          <div className="success-message">
            <h3>Booking Successful!</h3>
            <p>Your court has been booked successfully.</p>
          </div>
        ) : showPaymentConfirmation ? (
          <div className="payment-confirmation">
            <img 
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
              alt="Payment Confirmation" 
              className="payment-image"
            />
            <div className="payment-buttons">
              <button 
                className="payment-button cancel-payment"
                onClick={handleCancelPayment}
              >
                Cancel
              </button>
              <button 
                className="payment-button confirm-payment"
                onClick={handleConfirmPayment}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Payment Successful'}
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-content">
            <div className="form-group">
              
              <div className="date-duration-container">
                <div className="date-input-container">
                <label>Select Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="duration-container">
                  <label>Duration (minutes)</label>
                  <div className="duration-buttons">
                    <button
                      type="button"
                      className="duration-button"
                      onClick={() => setFormData(prev => ({ ...prev, duration: Math.max(court.minimumBookingDuration || 60, prev.duration - 30) }))}
                      disabled={formData.duration <= (court.minimumBookingDuration || 60)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="duration-input"
                      value={formData.duration}
                      onChange={(e) => {
                        const value = Math.min(180, Math.max(court.minimumBookingDuration || 60, Number(e.target.value)));
                        setFormData(prev => ({ ...prev, duration: value }));
                      }}
                      min={court.minimumBookingDuration || 60}
                      max={180}
                      step={30}
                    />
                    <button
                      type="button"
                      className="duration-button"
                      onClick={() => setFormData(prev => ({ ...prev, duration: Math.min(180, prev.duration + 30) }))}
                      disabled={formData.duration >= 180}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="time-slots">
              <h3>Available Time Slots</h3>
              <div className="slots-container">
                <div className="slots-grid" ref={slotsGridRef}>
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      className={`slot-button ${selectedSlot?.startTime === slot.startTime ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <FiClock />
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </button>
                  ))}
                </div>
                {availableSlots.length > 0 && (
                  <div className="scroll-buttons">
                    <button 
                      className="scroll-button" 
                      onClick={handleScrollLeft}
                      aria-label="Scroll left"
                    >
                      <FiChevronLeft />
                    </button>
                    <button 
                      className="scroll-button" 
                      onClick={handleScrollRight}
                      aria-label="Scroll right"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </div>
              {availableSlots.length === 0 && (
                <p className="no-slots">No available slots for selected date</p>
              )}
            </div>

            {selectedSlot && (
              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <div className="summary-item">
                  <span>Date:</span>
                  <span>{formData.date}</span>
                </div>
                <div className="summary-item">
                  <span>Time:</span>
                  <span>{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                </div>
                <div className="summary-item">
                  <span>Duration:</span>
                  <span>{formData.duration} minutes</span>
                </div>
                <div className="summary-item">
                  <span>Price:</span>
                  <span>₹{calculatePrice()}</span>
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button 
              className="book-button"
              onClick={handleBooking}
              disabled={loading || !selectedSlot}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        )}
      </div>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default UserBookingModal; 