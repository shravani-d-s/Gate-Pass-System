import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const GatePassVerify = () => {
  const navigate = useNavigate();

  const [approvedPasses, setApprovedPasses] = useState([]);
  const [selectedPass, setSelectedPass] = useState(null);

  // Load APPROVED & SORTED passes
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/api/gatepass/approved/sorted");
        setApprovedPasses(res.data.filter(p => !p.guardVerified)); // remove already verified
      } catch (err) {
        console.error("❌ Failed to load approved passes:", err);
      }
    };

    load();
  }, []);

  const openModal = (p) => setSelectedPass(p);
  const closeModal = () => setSelectedPass(null);

  // 🟢 Guard/Admin final verification
  const finalizeVerification = async (id) => {
    try {
      await API.put(`/api/gatepass/verify/final/${id}`);

      // 1. Remove this pass from the left-side list
      setApprovedPasses(prev => prev.filter(p => p._id !== id));

      // 2. Close modal
      setSelectedPass(null);

      alert("Gate pass verified successfully!");
    } catch (err) {
      console.error("❌ Final verification failed:", err);
      alert("Could not verify gate pass.");
    }
  };

  return (
    <div className="dashboard-content">

      {/* BACK BUTTON + CARD WRAPPER */}
      <div className="verify-wrapper">

        {/* BACK BUTTON */}
        <button
          className="verify-side-back-btn"
          onClick={() => navigate("/admin-dashboard")}
        >
          ⟵ Back
        </button>

        {/* MAIN CARD */}
        <div className="request-card verify-card">
          <h2>Verify Gate Pass</h2>

          {approvedPasses.length === 0 ? (
            <p>No approved passes pending for verification.</p>
          ) : (
            approvedPasses.map((pass) => (
              <div key={pass._id} className="verify-row">

                {/* Checkbox for final guard verification */}
                <input
                  type="checkbox"
                  onChange={() => finalizeVerification(pass._id)}
                />

                {/* Student Name */}
                <p
                  className="verify-name"
                  onClick={() => openModal(pass)}
                >
                  {pass.studentId?.name}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedPass && (
        <div className="modal-overlay">
          <div className="vnit-modal">

            {/* X CLOSE BUTTON */}
            <button className="modal-close-icon" onClick={closeModal}>
              ×
            </button>

            <h2>{selectedPass.studentId?.name}</h2>

            {/* Personal & Pass Details */}
            <div className="modal-details">
              <p><strong>Hostel:</strong> {selectedPass.hostelBlock}</p>
              <p><strong>Journey Date:</strong> {selectedPass.journeyDate}</p>
              <p><strong>Leaving Time:</strong> {selectedPass.leavingTime}</p>
              <p><strong>Destination:</strong> {selectedPass.destination}</p>
              <p><strong>Luggage:</strong> {selectedPass.luggageDetails}</p>
              <p><strong>Reason:</strong> {selectedPass.reason}</p>
            </div>

            <hr />

            {/* Transport Details Filled by Student */}
            <h3>Transport Details</h3>

            <input
              className="modal-input"
              type="text"
              value={selectedPass.cabNumber || ""}
              readOnly
              placeholder="Cab Number"
            />

            <input
              className="modal-input"
              type="text"
              value={selectedPass.transportMode || ""}
              readOnly
              placeholder="Mode of Transport"
            />

            <input
              className="modal-input"
              type="text"
              value={selectedPass.ticketNumber || ""}
              readOnly
              placeholder="Ticket Number"
            />

            <div className="modal-buttons">
              <button
                className="submit-btn"
                onClick={() => finalizeVerification(selectedPass._id)}
              >
                Verify Pass ✔
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GatePassVerify;
