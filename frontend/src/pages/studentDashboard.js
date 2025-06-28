import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const StudentDashboard = () => {
  const [form, setForm] = useState({
    reason: '',
    luggageDetails: ''
  });
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch student's previous requests
  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const res = await API.get('/gatepass/my-requests');
      setMyRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/gatepass/create', form);
      alert("Gate pass request submitted successfully!");
      setForm({ reason: '', luggageDetails: '' });
      
      // Re-fetch updated requests
      await fetchMyRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'rejected': return '#f44336';
      case 'pending': return '#8A2BE2';
      default: return '#8A2BE2';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.name}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="request-section">
          <h2>Request New Gate Pass</h2>
          <form onSubmit={handleSubmit} className="gatepass-form">
            <div className="form-group">
              <label htmlFor="reason">Reason for leaving:</label>
              <textarea
                id="reason"
                name="reason"
                placeholder="Enter the reason for your gate pass request"
                value={form.reason}
                onChange={handleChange}
                required
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="luggageDetails">Luggage Details:</label>
              <textarea
                id="luggageDetails"
                name="luggageDetails"
                placeholder="Describe any luggage you're carrying (e.g., laptop bag, books, etc.)"
                value={form.luggageDetails}
                onChange={handleChange}
                required
                rows="2"
              />
            </div>
            
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </section>

        <section className="history-section">
          <h2>My Gate Pass History</h2>
          {myRequests.length > 0 ? (
            <div className="requests-list">
              {myRequests.map((req) => (
                <div key={req._id} className="request-card">
                  <div className="request-header">
                    <span className="request-date">
                      {formatDate(req.requestDate)}
                    </span>
                    <span 
                      className="request-status"
                      style={{ color: getStatusColor(req.status) }}
                    >
                      {req.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="request-details">
                    <p><strong>Reason:</strong> {req.reason}</p>
                    <p><strong>Luggage:</strong> {req.luggageDetails}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-requests">No gate pass requests found.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;