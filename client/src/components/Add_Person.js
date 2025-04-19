import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

function Add_Person() {
    const[personID, set_personID] = useState('');
    const[first_name, set_first_name] = useState('');
    const[last_name, set_last_name] = useState('');
    const[locationID, set_locationID] = useState('');
    const[taxID, set_taxID] = useState('');
    const[experience, set_experience] = useState(false);
    const[miles, set_miles] = useState('');
    const[funds, set_funds] = useState(false);

    const[error, set_error] = useState(null);

    const SubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const getData = await fetch('http://localhost:8800/add_person', {
                method: 'POST',
                headers: {'type' : 'application/json'},
                body: JSON.stringify ({
                    ip_personID: personID,
                    ip_first_name: first_name,
                    ip_last_name : last_name,
                    ip_locationID : locationID,
                    ip_taxID: taxID,
                    ip_experience: experience === 'true', //convert to bool
                    ip_miles: miles,
                    ip_funds: funds  === 'true',
                }),
            });

            if (!(getData.ok)) {
                const errData = await getData.json();
                throw new Error("Person cannot be added");
            }

            alert("Person added!")

            clearFields();

        }

        catch (error){
            set_error(error.message)
        }

        
    };

    const clearFields = () =>{
        set_personID('');
        set_first_name('');
        set_last_name('');
        set_locationID('');
        set_taxID('');
        set_experience('false');
        set_miles('');
        set_funds('false');

        set_error(null);
    }

    const CancelHandler = () => {
        clearFields();
    }

    return(
        <div>
            <h1>Add Person</h1>
            {error && <p className="error">{error}</p>}

            <form onSubmit={SubmitHandler}>

                {/*PERSON ID*/}
                <div className = "form-group">
                    <label htmlFor = "personID"> Person ID</label>
                    <input type="text"
                        className = "form-control"
                        id="personID"
                        value = {personID}
                        onChange = {(e) => set_personID(e.target.value)}
                    />
                </div>

                {/*FIRST NAME*/}
                <div className = "form-group">
                    <label htmlFor = "firstName"> First Name</label>
                    <input type="text"
                        className = "form-control"
                        id="firstName"
                        value = {first_name}
                        onChange = {(e) => set_first_name(e.target.value)}
                    />
                </div>

                {/*LAST NAME*/}
                <div className = "form-group">
                    <label htmlFor = "lastName"> Last name</label>
                    <input type="text"
                        className = "form-control"
                        id="lastName"
                        value = {last_name}
                        onChange = {(e) => set_last_name(e.target.value)}
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

                {/*TAX ID*/}
                <div className = "form-group">
                    <label htmlFor = "taxID"> Tax ID</label>
                    <input type="text"
                        className = "form-control"
                        id="taxID"
                        value = {taxID}
                        onChange = {(e) => set_taxID(e.target.value)}
                    />
                </div>

                {/*EXPERIENCE*/}
                <div className = "form-group">
                    <label htmlFor = "experience"> Experience</label>
                    <input type="text"
                        className = "form-control"
                        id="experience"
                        value = {experience}
                        onChange = {(e) => set_experience(e.target.value)}
                    />
                </div>

                {/*MILES*/}
                <div className = "form-group">
                    <label htmlFor = "miles"> Miles</label>
                    <input type="text"
                        className = "form-control"
                        id="miles"
                        value = {miles}
                        onChange = {(e) => set_miles(e.target.value)}
                    />
                </div>

                {/*FUNDS*/}
                <div className = "form-group">
                    <label htmlFor = "funds"> Funds</label>
                    <input type="text"
                        className = "form-control"
                        id="funds"
                        value = {funds}
                        onChange = {(e) => set_funds(e.target.value)}
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



export default Add_Person;