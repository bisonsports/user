import { useState, useEffect, useRef } from 'react';
import { User, Calendar, ChevronDown, Clock, LogOut, Loader, Download } from 'lucide-react';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";
import { jsPDF } from 'jspdf';
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

  const generateInvoice = async (booking) => {
    try {
      // Fetch stadium details
      const db = getFirestore();
      const stadiumRef = doc(db, 'stadiums', booking.stadiumId);
      const stadiumDoc = await getDoc(stadiumRef);
      const stadiumData = stadiumDoc.data();

      // Create PDF
      const pdf = new jsPDF();
      
      // Add logo or header
      pdf.setFontSize(20);
      pdf.setTextColor(37, 99, 235); // Blue color
      pdf.text("Alpha Sports Booking Invoice", 105, 20, { align: "center" });
      
      // Add stadium info
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(stadiumData.name, 105, 35, { align: "center" });
      
      // Add booking details
      pdf.setFontSize(12);
      pdf.text([
        `Booking ID: ${booking.id}`,
        `Date: ${booking.date}`,
        `Time: ${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}`,
        `Court: ${booking.courtId}`,
        `Amount Paid: ₹${booking.amount}`,
        `Status: ${booking.status}`,
        `\nBooked By:`,
        `Name: ${userData.name}`,
        `Email: ${userData.email}`,
      ], 20, 50);

      // Add rules
      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      pdf.text([
        "\nImportant Rules & Guidelines:",
        "1. Please arrive 15 minutes before your scheduled time",
        "2. Carry valid ID proof for verification",
        "3. Wear appropriate sports attire and shoes",
        "4. No refunds for cancellations within 24 hours",
        "5. Follow all venue safety guidelines",
        "\nFor support, contact: support@alphasports.com"
      ], 20, 120);

      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text("This is a computer generated invoice", 105, 280, { align: "center" });

      // Save PDF
      pdf.save(`booking-invoice-${booking.id}.pdf`);
    } catch (error) {
      console.error('Error generating invoice:', error);
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
                          <div className="booking-actions">
                            <span className={`booking-status ${booking.status}`}>
                              {booking.status}
                            </span>
                            <button 
                              className="download-btn"
                              onClick={() => generateInvoice(booking)}
                              title="Download Invoice"
                            >
                              <Download size={14} />
                            </button>
                          </div>
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