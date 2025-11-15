import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const StudentDashboard = () => {
  const [form, setForm] = useState({
    name: '',
    hostelBlock: '',
    journeyDate: '',
    leavingTime: '',
    luggageDetails: '',
    destination: '',
    reason: ''
  });

  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch student's previous requests
  const fetchMyRequests = useCallback(async () => {
    try {
      const res = await API.get('/api/gatepass/my-requests');
      console.log("📥 Received request history:", res.data);
      setMyRequests(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch requests", err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  // Handle form input
  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    console.log("✏️ Updated form:", updated);
    setForm(updated);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("🚀 SUBMITTING FORM DATA:", form);

    try {
      const res = await API.post('/api/gatepass/create', form);

      console.log("✅ Backend Response:", res.data);

      alert("Gate pass request submitted successfully!");

      // Reset form
      setForm({
        name: '',
        hostelBlock: '',
        journeyDate: '',
        leavingTime: '',
        luggageDetails: '',
        destination: '',
        reason: ''
      });

      await fetchMyRequests();
    } catch (err) {
      console.error("❌ ERROR while submitting:", err);
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
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Hostel Block:</label>
              <select
                name="hostelBlock"
                value={form.hostelBlock}
                onChange={handleChange}
                required
              >
                <option value="">Select Hostel Block</option>
                <option value="HB-1">HB-1</option>
                <option value="HB-2">HB-2</option>
                <option value="HB-3">HB-3</option>
                <option value="HB-4">HB-4</option>
                <option value="HB-5">HB-5</option>
                <option value="HB-6">HB-6</option>
                <option value="HB-7">HB-7</option>
                <option value="HB-8">HB-8</option>
                <option value="HB-9">HB-9</option>
                <option value="HB-10">HB-10</option>
                <option value="GH-1">GH-1</option>
                <option value="GH-2">GH-2</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date of Journey:</label>
              <input
                type="date"
                name="journeyDate"
                value={form.journeyDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Time of Leaving:</label>
              <input
                type="time"
                name="leavingTime"
                value={form.leavingTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Luggage:</label>
              <input
                type="text"
                name="luggageDetails"
                value={form.luggageDetails}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Destination:</label>
              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Purpose:</label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit Request'}
            </button>
          </form>
        </section>

        {/* HISTORY */}
        <section className="history-section">
          <h2>My Gate Pass History</h2>

          {myRequests.length > 0 ? (
            <div className="requests-list">
              {myRequests.map((req) => (
                <div key={req._id} className="request-card">
                  <div className="request-header">
                    <span>{formatDate(req.requestDate)}</span>
                    <span style={{ color: getStatusColor(req.status) }}>
                      {req.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="request-details">
                    <p><strong>Name:</strong> {req.name}</p>
                    <p><strong>Hostel:</strong> {req.hostelBlock}</p>
                    <p><strong>Date:</strong> {req.journeyDate}</p>
                    <p><strong>Time:</strong> {req.leavingTime}</p>
                    <p><strong>Destination:</strong> {req.destination}</p>
                    <p><strong>Luggage:</strong> {req.luggageDetails}</p>
                    <p><strong>Reason:</strong> {req.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No gate pass requests found.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
