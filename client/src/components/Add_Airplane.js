import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

function Add_Airplane() {
    const[airlineID, set_airlineID] = useState('');
    const[tail_num, set_tail_num] = useState('');
    const[seat_capacity, set_seat_capacity] = useState('');
    const[speed, set_speed] = useState('');
    const[locationID, set_locationID] = useState('');
    const[plane_type, set_plane_type] = useState('');
    const[maintenanced, set_maintenanced] = useState(false);
    const[model, set_model] = useState('');
    const[neo, set_neo] = useState(false);

    const[error, set_error] = useState(null);

    const SubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const getData = await fetch('http://localhost:8800/add_airplane', {
                method: 'POST',
                headers: {'type' : 'application/json'},
                body: JSON.stringify ({
                    ip_airlineID: airlineID,
                    ip_tail_num: tail_num,
                    ip_seat_capacity : seat_capacity,
                    ip_speed: speed,
                    ip_locationID : locationID,
                    ip_plane_type: plane_type,
                    ip_maintenanced: maintenanced === 'true', //convert to bool
                    ip_model: model,
                    ip_neo: neo  === 'true',
                }),
            });

            if (!(getData.ok)) {
                const errData = await getData.json();
                throw new Error("Airplane cannot be added");
            }

            alert("Airplane added!")

            clearFields();

        }

        catch (error){
            set_error(error.message)
        }

        
    };

    const clearFields = () =>{
        set_airlineID('');
        set_tail_num('');
        set_seat_capacity('');
        set_speed('');
        set_locationID('');
        set_plane_type('');
        set_maintenanced('false');
        set_model('');
        set_neo('false');

        set_error(null);
    }

    const CancelHandler = () => {
        clearFields();
    }

    return(
        <div>
            <h1>Add Airplane</h1>
            {error && <p className="error">{error}</p>}

            <form onSubmit={SubmitHandler}>

                {/*AIRLINE ID*/}
                <div className = "form-group">
                    <label htmlFor = "airlineId"> Airline ID</label>
                    <input type="text"
                        className = "form-control"
                        id="airlineId"
                        value = {airlineID}
                        onChange = {(e) => set_airlineID(e.target.value)}
                    />
                </div>

                {/*TAIL NUM*/}
                <div className = "form-group">
                    <label htmlFor = "tailNum"> Tail Num</label>
                    <input type="text"
                        className = "form-control"
                        id="tailNum"
                        value = {tail_num}
                        onChange = {(e) => set_tail_num(e.target.value)}
                    />
                </div>

                {/*SEAT CAPACITY*/}
                <div className = "form-group">
                    <label htmlFor = "seatCap"> Seat Cap</label>
                    <input type="text"
                        className = "form-control"
                        id="seatCap"
                        value = {seat_capacity}
                        onChange = {(e) => set_seat_capacity(e.target.value)}
                    />
                </div>

                {/*SPEED*/}
                <div className = "form-group">
                    <label htmlFor = "speed"> Speed</label>
                    <input type="text"
                        className = "form-control"
                        id="speed"
                        value = {speed}
                        onChange = {(e) => set_speed(e.target.value)}
                    />
                </div>

                {/*LOCATION ID*/}
                <div className = "form-group">
                    <label htmlFor = "locationId"> Location ID</label>
                    <input type="text"
                        className = "form-control"
                        id="locationId"
                        value = {locationID}
                        onChange = {(e) => set_locationID(e.target.value)}
                    />
                </div>

                {/*PLANE TYPE*/}
                <div className = "form-group">
                    <label htmlFor = "planeType"> Plane Type</label>
                    <input type="text"
                        className = "form-control"
                        id="planeType"
                        value = {plane_type}
                        onChange = {(e) => set_plane_type(e.target.value)}
                    />
                </div>

                {/*MAINTENANCED*/}
                <div className = "form-group">
                    <label htmlFor = "maintenanced"> Maintenanced</label>
                    <input type="text"
                        className = "form-control"
                        id="maintenanced"
                        value = {maintenanced}
                        onChange = {(e) => set_maintenanced(e.target.value)}
                    />
                </div>

                {/*MODEL*/}
                <div className = "form-group">
                    <label htmlFor = "model"> Model</label>
                    <input type="text"
                        className = "form-control"
                        id="model"
                        value = {model}
                        onChange = {(e) => set_model(e.target.value)}
                    />
                </div>

                {/*NEO*/}
                <div className = "form-group">
                    <label htmlFor = "neo"> Neo</label>
                    <input type="text"
                        className = "form-control"
                        id="neo"
                        value = {neo}
                        onChange = {(e) => set_neo(e.target.value)}
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



export default Add_Airplane;