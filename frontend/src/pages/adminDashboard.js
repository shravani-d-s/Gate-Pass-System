import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AdminDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // FIX: Wrap function in useCallback so it can be added to dependency array
  const fetchPendingRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/gatepass/pending');
      setPendingRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch pending requests', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Now add it to dependency array safely
  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const handleApprove = async (id) => {
    try {
      await API.post(`/api/gatepass/approve/${id}`);
      alert('Gate pass approved successfully!');
      setPendingRequests(pendingRequests.filter(req => req._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve gate pass');
    }
  };

  const handleReject = async (id) => {
    try {
      await API.post(`/api/gatepass/reject/${id}`);
      alert('Gate pass rejected successfully!');
      setPendingRequests(pendingRequests.filter(req => req._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject gate pass');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.name}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="pending-section">
          <h2>Pending Gate Pass Requests ({pendingRequests.length})</h2>
          
          {loading ? (
            <p>Loading requests...</p>
          ) : pendingRequests.length === 0 ? (
            <div className="no-requests">
              <p>No pending requests at the moment.</p>
            </div>
          ) : (
            <div className="requests-grid">
              {pendingRequests.map((req) => (
                <div key={req._id} className="request-card pending">
                  <div className="request-header">
                    <div className="student-info">
                      <h3>{req.studentId?.name || 'Unknown Student'}</h3>
                      <p className="roll-number">Roll: {req.studentId?.rollNumber || 'N/A'}</p>
                    </div>
                    <div className="request-date">
                      <small>{formatDate(req.requestDate)}</small>
                    </div>
                  </div>
                  
                  <div className="request-details">
                    <div className="detail-group">
                      <label>Reason:</label>
                      <p>{req.reason}</p>
                    </div>
                    <div className="detail-group">
                      <label>Luggage Details:</label>
                      <p>{req.luggageDetails}</p>
                    </div>
                  </div>
                  
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleApprove(req._id)}
                      className="approve-btn"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(req._id)}
                      className="reject-btn"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
