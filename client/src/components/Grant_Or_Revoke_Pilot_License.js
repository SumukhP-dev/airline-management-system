import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

function Grant_Or_Revoke_Pilot_License() {
    const[personId, setPersonId] = useState('');
    const[license, setLicense] = useState('');

    const[error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:8800/grant-or-revoke-pilot-license', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    personId,
                    license,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to grant/revoke license');
            }

            alert("License revoked or granted successfully!");
            clearFields();
        } catch (error) {
            setError(error.message);
        }
    };

    const clearFields = () => {
        setPersonId('');
        setLicense('');
    };

    return(
        <div className="container mt-4">
            <h1>Grant or Revoke Pilot License</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="personId">Person ID</label>
                    <input
                        type="text"
                        className="form-control"
                        id="personId"
                        value={personId}
                        onChange={(e) => setPersonId(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="license">License</label>
                    <input
                        type="text"
                        className="form-control"
                        id="license"
                        value={license}
                        onChange={(e) => setLicense(e.target.value)}
                        required
                    />
                </div>

                <div className="mt-3">
                    <button type="submit" className="btn btn-primary me-2">
                        Grant or Revoke Pilot License
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

export default Grant_Or_Revoke_Pilot_License;