import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './UserBookingModal.css';
import { FiX, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const UserBookingModal = ({ isOpen, onClose, court, venue }) => {
  const [formData, setFormData] = useState({
    date: '',
    duration: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const slotsGridRef = useRef(null);

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
      setError('Please login to book a court');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingData = {
        amount: calculatePrice(),
        coachId: null,
        courtId: court.id,
        date: formData.date,
        stadiumId: venue.stadiumId,
        status: 'pending',
        timeSlot: {
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime
        },
        userId: userData.uid
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      setShowSuccessMessage(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError('Failed to book the court. Please try again.');
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
      <div className="booking-modal">
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
        ) : (
          <div className="modal-content">
            <div className="form-group">
              <label>Select Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                min={court.minimumBookingDuration || 60}
                max={180}
                step={30}
                value={formData.duration}
                onChange={(e) => {
                  const value = Math.min(180, Math.max(court.minimumBookingDuration || 60, Number(e.target.value)));
                  setFormData(prev => ({ ...prev, duration: value }));
                }}
                className="duration-input"
              />
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
    </div>
  );
};

export default UserBookingModal; 