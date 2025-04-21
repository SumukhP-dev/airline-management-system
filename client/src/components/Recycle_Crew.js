import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Recycle_Crew() {
  const [flightID, setFlightID] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8800/recycle_crew", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flightID,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to recycle crew");
      }

      alert("Crew recycled successfully!");
      clearFields();
    } catch (error) {
      setError(error.message);
    }
  };

  const clearFields = () => {
    setFlightID("");
  };

  return (
    <div className="container mt-4">
      <h1>Recycle Crew</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="flightID">Flight ID</label>
          <input
            type="text"
            className="form-control"
            id="flightID"
            value={flightID}
            onChange={(e) => setFlightID(e.target.value)}
            required
          />
        </div>

        <div className="mt-3">
          <button type="submit" className="btn btn-primary me-2">
            Recycle Crew
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={clearFields}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Recycle_Crew;
