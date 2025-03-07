import React from 'react';
import './TrainersPage.css';

const trainersData = [
  {
    id: 1,
    name: 'John Smith',
    sports: ['Cricket', 'Baseball'],
    stadium: 'Sports Complex Alpha',
    experience: '10 years',
    timings: '6:00 AM - 8:00 PM',
    specialization: 'Performance Training',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3',
    rating: 4.8,
    price: '₹1000/session'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    sports: ['Tennis', 'Badminton'],
    stadium: 'Elite Sports Center',
    experience: '8 years',
    timings: '7:00 AM - 9:00 PM',
    specialization: 'Youth Training',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3',
    rating: 4.9,
    price: '₹1200/session'
  },
  {
    id: 3,
    name: 'Mike Wilson',
    sports: ['Football', 'Athletics'],
    stadium: 'Victory Arena',
    experience: '12 years',
    timings: '5:00 AM - 7:00 PM',
    specialization: 'Strength & Conditioning',
    image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?ixlib=rb-4.0.3',
    rating: 4.7,
    price: '₹1500/session'
  }
];

const TrainersPage = () => {
  return (
    <div className="trainers-page">
      <div className="trainers-header">
        <h1>Expert Trainers</h1>
        <p>Find the perfect trainer to help you achieve your fitness goals</p>
      </div>

      <div className="trainers-grid">
        {trainersData.map((trainer) => (
          <div key={trainer.id} className="trainer-card">
            <div className="trainer-image">
              <img src={trainer.image} alt={trainer.name} />
              <div className="trainer-rating">
                <span>★</span> {trainer.rating}
              </div>
            </div>
            <div className="trainer-info">
              <h2>{trainer.name}</h2>
              <div className="trainer-sports">
                {trainer.sports.map((sport, index) => (
                  <span key={index} className="sport-tag">{sport}</span>
                ))}
              </div>
              <div className="trainer-details">
                <div className="detail-item">
                  <strong>Stadium:</strong> {trainer.stadium}
                </div>
                <div className="detail-item">
                  <strong>Experience:</strong> {trainer.experience}
                </div>
                <div className="detail-item">
                  <strong>Timings:</strong> {trainer.timings}
                </div>
                <div className="detail-item">
                  <strong>Specialization:</strong> {trainer.specialization}
                </div>
                <div className="detail-item price">
                  <strong>Price:</strong> {trainer.price}
                </div>
              </div>
              <button className="book-trainer-btn">Book Session</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainersPage; 