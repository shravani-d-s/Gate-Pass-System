import React, { useState } from 'react';
import API from '../services/api';

const GatePassForm = () => {
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/gatepass/request', { reason, date });
      alert('Gate pass requested successfully!');
      setReason('');
      setDate('');
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Request Gate Pass</h2>
      <input
        type="text"
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default GatePassForm;
