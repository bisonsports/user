import React from 'react';
import Hero from "../components/Hero";
import SportsCards from "../components/SportsCards";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="app">
      <Hero />
      <SportsCards />
      <About />
      <Testimonials />
      <Footer />
      <Link to="/venues" className="see-all-venues-btn">
        See All Venues
      </Link>
    </div>
  );
};

export default Home; 