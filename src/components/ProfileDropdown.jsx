import { useState, useEffect, useRef } from 'react';
import { User, Calendar, ChevronDown, Clock, LogOut, Loader } from 'lucide-react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";
import './ProfileDropdown.css';

const ProfileDropdown = ({ userData, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [allBookingsCache, setAllBookingsCache] = useState([]);
  const dropdownRef = useRef(null);
  const ITEMS_PER_PAGE = 5;

  const refreshBookings = () => {
    setCurrentPage(0);
    setBookings([]);
    setAllBookingsCache([]);
    if (isOpen) {
      fetchBookings(true);
    }
  };

  // Expose the refresh function globally
  window.refreshProfileBookings = refreshBookings;

  const fetchBookings = async (isInitial = false) => {
    if (!userData?.uid) {
      console.error('No UID available');
      return;
    }

    try {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }

      let allBookings = [];
      
      if (isInitial || allBookingsCache.length === 0) {
        const db = getFirestore();
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('userId', '==', userData.uid));
        const querySnapshot = await getDocs(q);

        allBookings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort bookings by date (newest first)
        allBookings.sort((a, b) => {
          // Convert dates to timestamps for comparison
          const dateA = new Date(a.date + ' ' + a.timeSlot.startTime).getTime();
          const dateB = new Date(b.date + ' ' + b.timeSlot.startTime).getTime();
          return dateB - dateA; // Descending order
        });
        
        // Cache all bookings
        setAllBookingsCache(allBookings);
      } else {
        // Use cached data
        allBookings = allBookingsCache;
      }

      // Simulate 3-second loading for pagination
      if (!isInitial) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Handle pagination
      const page = isInitial ? 0 : currentPage + 1;
      const start = page * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const paginatedBookings = allBookings.slice(start, end);
      
      setHasMore(allBookings.length > end);
      setCurrentPage(page);
      
      if (isInitial) {
        setBookings(paginatedBookings);
      } else {
        setBookings(prev => [...prev, ...paginatedBookings]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen && userData?.uid && bookings.length === 0) {
      fetchBookings(true);
    }
  }, [isOpen, userData?.uid]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup effect for the global refresh function
  useEffect(() => {
    return () => {
      delete window.refreshProfileBookings;
    };
  }, []);

  const loadMore = () => {
    fetchBookings(false);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      if (onLogout) onLogout();
      setIsOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Debug log for userData
  console.log("Current userData:", userData);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        className="profile-button"
        onClick={() => {
          setIsOpen(!isOpen);
          console.log("Profile button clicked, userData:", userData); // Debug log
        }}
      >
        <User className="profile-icon" />
        <ChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="dropdown-content">
          <div className="user-info">
            <div className="user-header">
              <User className="user-avatar" />
              <div className="user-details">
                <h3>{userData.name}</h3>
                <p>{userData.email}</p>
              </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          <div className="booking-history">
            <h4>Recent Bookings</h4>
            {bookings.length > 0 ? (
              <>
                <div className={`bookings-list ${loadingMore ? 'loading' : ''}`}>
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-item">
                      <div className="booking-icon">
                        <Calendar />
                      </div>
                      <div className="booking-details">
                        <h5>Booking on {booking.date}</h5>
                        <div className="booking-time">
                          {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                        </div>
                        <div className="booking-meta">
                          <span className="booking-amount">₹{booking.amount}</span>
                          <span className={`booking-status ${booking.status}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loadingMore && (
                    <div className="load-more-spinner">
                      <Loader className="spinner" size={24} />
                    </div>
                  )}
                </div>
                {hasMore && !loadingMore && (
                  <button 
                    className="load-more-btn"
                    onClick={loadMore}
                  >
                    Load More
                  </button>
                )}
              </>
            ) : initialLoading ? (
              <div className="initial-loading">
                <Loader className="spinner" size={24} />
                <span>Loading bookings...</span>
              </div>
            ) : (
              <p className="no-bookings">No bookings found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 