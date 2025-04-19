import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

function Add_Airport() {
    const[airportID, set_airportID] = useState('');
    const[airport_name, set_airport_name] = useState('');
    const[city, set_city] = useState('');
    const[state, set_state] = useState('');
    const[country, set_country] = useState('');
    const[locationID, set_locationID] = useState('');

    const[error, set_error] = useState(null);

    const SubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const getData = await fetch('http://localhost:8800/add_airport', {
                method: 'POST',
                headers: {'type' : 'application/json'},
                body: JSON.stringify ({
                    ip_airportID: airportID,
                    ip_airport_name: airport_name,
                    ip_city : city,
                    ip_state: state,
                    ip_country : country,
                    ip_locationID: locationID,
                }),
            });

            if (!(getData.ok)) {
                const errData = await getData.json();
                throw new Error("Airport cannot be added");
            }

            alert("Airport added!")

            clearFields();

        }

        catch (error){
            set_error(error.message)
        }

        
    };

    const clearFields = () =>{
        set_airportID('');
        set_airport_name('');
        set_city('');
        set_state('');
        set_country('');
        set_locationID('');

        set_error(null);
    }

    const CancelHandler = () => {
        clearFields();
    }

    return(
        <div>
            <h1>Add Airport</h1>
            {error && <p className="error">{error}</p>}

            <form onSubmit={SubmitHandler}>

                {/*AIRPORT ID*/}
                <div className = "form-group">
                    <label htmlFor = "airportID"> Airport ID</label>
                    <input type="text"
                        className = "form-control"
                        id="airportID"
                        value = {airportID}
                        onChange = {(e) => set_airportID(e.target.value)}
                    />
                </div>

                {/*AIRPORT NAME*/}
                <div className = "form-group">
                    <label htmlFor = "airportName"> Airport Name</label>
                    <input type="text"
                        className = "form-control"
                        id="airportName"
                        value = {airport_name}
                        onChange = {(e) => set_airport_name(e.target.value)}
                    />
                </div>

                {/*CITY*/}
                <div className = "form-group">
                    <label htmlFor = "city"> City</label>
                    <input type="text"
                        className = "form-control"
                        id="city"
                        value = {city}
                        onChange = {(e) => set_city(e.target.value)}
                    />
                </div>

                {/*STATE*/}
                <div className = "form-group">
                    <label htmlFor = "state"> State</label>
                    <input type="text"
                        className = "form-control"
                        id="state"
                        value = {state}
                        onChange = {(e) => set_state(e.target.value)}
                    />
                </div>

                {/*COUNTRY*/}
                <div className = "form-group">
                    <label htmlFor = "country"> Country</label>
                    <input type="text"
                        className = "form-control"
                        id="country"
                        value = {country}
                        onChange = {(e) => set_country(e.target.value)}
                    />
                </div>

                {/*LOCATION ID*/}
                <div className = "form-group">
                    <label htmlFor = "locationID"> Location ID</label>
                    <input type="text"
                        className = "form-control"
                        id="locationID"
                        value = {locationID}
                        onChange = {(e) => set_locationID(e.target.value)}
                    />
                </div>

                {/*SUBMIT*/}
                <button type = "submit" className = "btn btn-primary">
                    Add
                </button>

                {/*CANCEL*/}
                <button type = "button" className = "btn btn-secondary"
                    onClick={CancelHandler}>

                    Cancel
                </button>

            </form>

        </div>
    )

}



export default Add_Airport;