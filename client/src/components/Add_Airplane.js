import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

function Add_Airplane() {
    const[airlineId, setAirlineId] = useState('');
    const[tailNum, setTailNum] = useState('');
    const[seatCap, setSeatCap] = useState('');
    const[speed, setSpeed] = useState('');
    const[locationId, setLocationId] = useState('');
    const[planeType, setPlaneType] = useState('');
    const[maintained, setMaintained] = useState(false);
    const[model, setModel] = useState('');
    const[neo, setNeo] = useState(false);

    const[error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:8800/add-airplane', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    airlineId,
                    tailNum,
                    seatCap: parseInt(seatCap),
                    speed: parseInt(speed),
                    locationId,
                    planeType,
                    maintained,
                    model,
                    neo
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add airplane');
            }

            alert("Airplane added successfully!");
            clearFields();
        } catch (error) {
            setError(error.message);
        }
    };

    const clearFields = () => {
        setAirlineId('');
        setTailNum('');
        setSeatCap('');
        setSpeed('');
        setLocationId('');
        setPlaneType('');
        setMaintained(false);
        setModel('');
        setNeo(false);
    };

    return(
        <div className="container mt-4">
            <h1>Add Airplane</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="airlineId">Airline ID</label>
                    <input
                        type="text"
                        className="form-control"
                        id="airlineId"
                        value={airlineId}
                        onChange={(e) => setAirlineId(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="tailNum">Tail Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="tailNum"
                        value={tailNum}
                        onChange={(e) => setTailNum(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="seatCap">Seat Capacity</label>
                    <input
                        type="number"
                        className="form-control"
                        id="seatCap"
                        value={seatCap}
                        onChange={(e) => setSeatCap(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="speed">Speed</label>
                    <input
                        type="number"
                        className="form-control"
                        id="speed"
                        value={speed}
                        onChange={(e) => setSpeed(e.target.value)}
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

                <div className="form-group mb-3">
                    <label htmlFor="planeType">Plane Type</label>
                    <input
                        type="text"
                        className="form-control"
                        id="planeType"
                        value={planeType}
                        onChange={(e) => setPlaneType(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="maintained">Maintained</label>
                    <select
                        className="form-control"
                        id="maintained"
                        value={maintained}
                        onChange={(e) => setMaintained(e.target.value === 'true')}
                        required
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="model">Model</label>
                    <input
                        type="text"
                        className="form-control"
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="neo">NEO</label>
                    <select
                        className="form-control"
                        id="neo"
                        value={neo}
                        onChange={(e) => setNeo(e.target.value === 'true')}
                        required
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <div className="mt-3">
                    <button type="submit" className="btn btn-primary me-2">
                        Add Airplane
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

export default Add_Airplane;