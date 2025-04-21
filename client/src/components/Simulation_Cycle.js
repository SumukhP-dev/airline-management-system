import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Simulation_Cycle() {
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8800/simulation_cycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to simulate cycle");
      }

      alert("Cycle simulated successfully!");
      clearFields();
    } catch (error) {
      setError(error.message);
    }
  };

  const clearFields = () => {};

  return (
    <div className="container mt-4">
      <h1>Simulation Cycle</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mt-3">
          <button type="submit" className="btn btn-primary me-2">
            Simulation Cycle
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

export default Simulation_Cycle;
