import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

function Flights_On_Ground() {
    const[flights, setFlights] = useState(['']);

    const[error, setError] = useState(null);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await fetch('http://localhost:8800/flights_on_the_ground');

                if(!response.ok) {
                    throw new Error('Fetch flight_on_ground failed');
                }

                const data = await response.json();

                const getFlights = data.result.map(item => ({
                    departing_from: item[0],
                    num_flights: item[1],
                    flight_list: item[2],
                    earliest_arrival: item[3],
                    latest_arrival: item[4],
                    airplane_list: item[5],
                }));

                setFlights(getFlights);
               
            } catch (error) {
                setError(error.message);
            }
        };

        fetchFlights();
        
    }, []);

    if (error) {
        return <div> Error: {error}</div>;
    }

    return(
        <div className="container mt-4">
            <h1>Flight on the Ground</h1>

            {flights.length > 0 ? (

 
                <table className = "table">
                    <thead>
                        <tr>
                            <th>departing_from</th>
                            <th>num_flights</th>
                            <th>flight_list</th>
                            <th>earliest_arrival</th>
                            <th>latest_arrival</th>
                            <th>airplane_list</th>
                        </tr>
                    </thead>

                    <tbody>
                        {flights.map(flight => (
                            <tr key = {flight.departing_from + flight.num_flights}>
                                <td>{flight.departing_from}</td>
                                <td>{flight.num_flights}</td>
                                <td>{flight.flight_list}</td>
                                <td>{flight.earliest_arrival}</td>
                                <td>{flight.latest_arrival}</td>
                                <td>{flight.airplane_list}</td>
                            </tr>
                        ))}
                    </tbody>
                
                </table> 
                
            ) : (<p> No flights are on the ground</p>)
            }
                
        </div>
    );
}

export default Flights_On_Ground;