import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

function Offer_Flight() {
    const[flightId, setFlightId] = useState('');
    const[routeId, setRouteId] = useState('');
    const[support_airline, setSupportAirline] = useState('');
    const[support_tail, setSupportTail] = useState('');
    const[progress, setProgress] = useState('');
    const[nextTime, setNextTime] = useState('');
    const[cost, setCost] = useState('');

    const[error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:8800/offer-flight', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    flightId,
                    routeId,
                    support_airline,
                    support_tail,
                    progress: parseInt(progress),
                    nextTime,
                    cost: parseInt(cost),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add flight');
            }

            alert("Flight added successfully!");
            clearFields();
        } catch (error) {
            setError(error.message);
        }
    };

    const clearFields = () => {
        setFlightId('');
        setRouteId('');
        setSupportAirline('');
        setSupportTail('');
        setProgress('');
        setNextTime('');
        setCost('');
    };

    return(
        <div className="container mt-4">
            <h1>Offer Flight</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="flightId">Flight ID</label>
                    <input
                        type="text"
                        className="form-control"
                        id="flightId"
                        value={flightId}
                        onChange={(e) => setFlightId(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="routeId">Route ID</label>
                    <input
                        type="text"
                        className="form-control"
                        id="routeId"
                        value={routeId}
                        onChange={(e) => setRouteId(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="support_airline">Support Airline</label>
                    <input
                        type="text"
                        className="form-control"
                        id="support_airline"
                        value={support_airline}
                        onChange={(e) => setSupportAirline(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="support_tail">Support Tail</label>
                    <input
                        type="text"
                        className="form-control"
                        id="support_tail"
                        value={support_tail}
                        onChange={(e) => setSupportTail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="progress">Progress</label>
                    <input
                        type="number"
                        className="form-control"
                        id="progress"
                        value={progress}
                        onChange={(e) => setProgress(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="nextTime">Next Time</label>
                    <input
                        type="string"
                        className="form-control"
                        id="nextTime"
                        value={nextTime}
                        onChange={(e) => setNextTime(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="cost">Cost</label>
                    <input
                        type="number"
                        className="form-control"
                        id="cost"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        required
                    />
                </div>

                <div className="mt-3">
                    <button type="submit" className="btn btn-primary me-2">
                        Add Flight
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

export default Offer_Flight;