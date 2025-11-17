import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const GatePassVerify = () => {
  const navigate = useNavigate();

  const [approvedPasses, setApprovedPasses] = useState([]);
  const [selectedPass, setSelectedPass] = useState(null);

  const [transport, setTransport] = useState({
    cabNumber: "",
    transportMode: "",
    ticketNumber: "",
  });

  const [checked, setChecked] = useState({}); // checkbox tracking

  // Load only APPROVED gatepasses
  useEffect(() => {
    const load = async () => {
      const res = await API.get("/api/gatepass/approved");
      setApprovedPasses(res.data);

      // auto-check those already verified
      const initialChecked = {};
      res.data.forEach((p) => {
        if (p.cabNumber || p.transportMode || p.ticketNumber) {
          initialChecked[p._id] = true;
        }
      });
      setChecked(initialChecked);
    };
    load();
  }, []);

  const openModal = (p) => {
    setSelectedPass(p);
    setTransport({
      cabNumber: "",
      transportMode: "",
      ticketNumber: "",
    });
  };

  const closeModal = () => setSelectedPass(null);

  const saveTransportDetails = async () => {
    if (
      !transport.cabNumber.trim() ||
      !transport.transportMode.trim() ||
      !transport.ticketNumber.trim()
    ) {
      alert("All transport details are required.");
      return;
    }

    await API.post(`/api/gatepass/verify/${selectedPass._id}`, transport);

    alert("Transport details saved!");

    // automatically tick the checkbox
    setChecked((prev) => ({ ...prev, [selectedPass._id]: true }));

    closeModal();
  };

  return (
    <div className="dashboard-content">

      {/* BACK BUTTON + CARD WRAPPER */}
      <div className="verify-wrapper">

        {/* BACK BUTTON LEFT SIDE */}
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
            <p>No approved passes yet.</p>
          ) : (
            approvedPasses.map((pass) => (
              <div key={pass._id} className="verify-row">
                <input
                  type="checkbox"
                  checked={checked[pass._id] || false}
                  disabled={checked[pass._id] || false}
                />

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

            <div className="modal-details">
              <p><strong>Hostel:</strong> {selectedPass.hostelBlock}</p>
              <p><strong>Journey Date:</strong> {selectedPass.journeyDate}</p>
              <p><strong>Leaving Time:</strong> {selectedPass.leavingTime}</p>
              <p><strong>Destination:</strong> {selectedPass.destination}</p>
              <p><strong>Luggage:</strong> {selectedPass.luggageDetails}</p>
              <p><strong>Reason:</strong> {selectedPass.reason}</p>
            </div>

            <hr />

            <h3>Transport Details</h3>

            <input
              className="modal-input"
              type="text"
              placeholder="Cab Number"
              value={transport.cabNumber}
              onChange={(e) =>
                setTransport({ ...transport, cabNumber: e.target.value })
              }
              required
            />

            <input
              className="modal-input"
              type="text"
              placeholder="Mode of Transport"
              value={transport.transportMode}
              onChange={(e) =>
                setTransport({ ...transport, transportMode: e.target.value })
              }
              required
            />

            <input
              className="modal-input"
              type="text"
              placeholder="Ticket Number"
              value={transport.ticketNumber}
              onChange={(e) =>
                setTransport({ ...transport, ticketNumber: e.target.value })
              }
              required
            />

            <div className="modal-buttons">
              <button className="submit-btn" onClick={saveTransportDetails}>
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GatePassVerify;
