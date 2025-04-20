import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

function Add_Airport() {
    const[airportCode, setAirportCode] = useState('');
    const[airportName, setAirportName] = useState('');
    const[city, setCity] = useState('');
    const[state, setState] = useState('');
    const[country, setCountry] = useState('');
    const[locationId, setLocationId] = useState('');

    const[error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:8800/add-airport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    airportCode,
                    airportName,
                    city,
                    state,
                    country,
                    locationId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add airport');
            }

            alert("Airport added successfully!");
            clearFields();
        } catch (error) {
            setError(error.message);
        }
    };

    const clearFields = () => {
        setAirportCode('');
        setAirportName('');
        setCity('');
        setState('');
        setCountry('');
        setLocationId('');
    };

    return(
        <div className="container mt-4">
            <h1>Add Airport</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="airportCode">Airport Code</label>
                    <input
                        type="text"
                        className="form-control"
                        id="airportCode"
                        value={airportCode}
                        onChange={(e) => setAirportCode(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="airportName">Airport Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="airportName"
                        value={airportName}
                        onChange={(e) => setAirportName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="city">City</label>
                    <input
                        type="text"
                        className="form-control"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="state">State</label>
                    <input
                        type="text"
                        className="form-control"
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="country">Country</label>
                    <input
                        type="text"
                        className="form-control"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="locationId">Location ID</label>
                    <input
                        type="text"
                        className="form-control"
                        id="locationId"
                        value={locationId}
                        onChange={(e) => setLocationId(e.target.value)}
                        required
                    />
                </div>

                <div className="mt-3">
                    <button type="submit" className="btn btn-primary me-2">
                        Add Airport
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

export default Add_Airport;