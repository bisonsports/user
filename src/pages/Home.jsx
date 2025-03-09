import React, { useState } from 'react';
import { Scan } from 'lucide-react';
import ScanModal from '../components/ScanModal';
import Hero from "../components/Hero";
import SportsCards from "../components/SportsCards";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const handleScanSuccess = (result) => {
    console.log('Scanned QR Code:', result);
    // Handle the scanned QR code result here
  };

  return (
    <div className="home">
      <Hero />
      <SportsCards />
      <About />
      <Testimonials />
      <Footer />
      <Link to="/venues" className="see-all-venues-btn">
        See All Venues
      </Link>
      
      <button 
        className="scan-button"
        onClick={() => setIsScanModalOpen(true)}
        aria-label="Scan QR Code"
      >
        <Scan size={24} />
      </button>

      <ScanModal 
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default Home; 