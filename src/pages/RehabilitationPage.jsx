import React from 'react';
import './RehabilitationPage.css';

const specialistsData = [
  {
    id: 1,
    name: 'Dr. Emily Parker',
    type: 'Sports Physiotherapist',
    specialization: ['Joint Rehabilitation', 'Post-Surgery Recovery'],
    experience: '15 years',
    clinic: 'HealthCare Plus',
    timings: '9:00 AM - 5:00 PM',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3',
    rating: 4.9,
    price: '₹1500/session'
  },
  {
    id: 2,
    name: 'Dr. James Wilson',
    type: 'Sports Nutritionist',
    specialization: ['Performance Nutrition', 'Weight Management'],
    experience: '12 years',
    clinic: 'Elite Wellness Center',
    timings: '10:00 AM - 6:00 PM',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3',
    rating: 4.8,
    price: '₹1200/session'
  },
  {
    id: 3,
    name: 'Dr. Sarah Thompson',
    type: 'Sports Physician',
    specialization: ['Injury Prevention', 'Performance Enhancement'],
    experience: '18 years',
    clinic: 'Sports Medicine Institute',
    timings: '8:00 AM - 4:00 PM',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3',
    rating: 5.0,
    price: '₹2000/session'
  }
];

const RehabilitationPage = () => {
  return (
    <div className="rehab-page">
      <div className="rehab-header">
        <h1>Sports Rehabilitation Specialists</h1>
        <p>Expert care for your recovery and performance enhancement</p>
      </div>

      <div className="specialists-grid">
        {specialistsData.map((specialist) => (
          <div key={specialist.id} className="specialist-card">
            <div className="specialist-image">
              <img src={specialist.image} alt={specialist.name} />
              <div className="specialist-rating">
                <span>★</span> {specialist.rating}
              </div>
              <div className="specialist-type">{specialist.type}</div>
            </div>
            <div className="specialist-info">
              <h2>{specialist.name}</h2>
              <div className="specialization-tags">
                {specialist.specialization.map((spec, index) => (
                  <span key={index} className="spec-tag">{spec}</span>
                ))}
              </div>
              <div className="specialist-details">
                <div className="detail-item">
                  <strong>Clinic:</strong> {specialist.clinic}
                </div>
                <div className="detail-item">
                  <strong>Experience:</strong> {specialist.experience}
                </div>
                <div className="detail-item">
                  <strong>Timings:</strong> {specialist.timings}
                </div>
                <div className="detail-item price">
                  <strong>Consultation Fee:</strong> {specialist.price}
                </div>
              </div>
              <button className="book-specialist-btn">Book Consultation</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RehabilitationPage; 