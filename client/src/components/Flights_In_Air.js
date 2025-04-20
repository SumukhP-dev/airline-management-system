import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

function Flights_In_Air() {
    const[flights, setFlights] = useState(['']);

    const[error, setError] = useState(null);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await fetch('http://localhost:8800/flights_in_the_air');

                if(!response.ok) {
                    throw new Error('Fetch flight_in_air failed');
                }

                const data = await response.json();

                const getFlights = data.result.map(item => ({
                    departing_from: item[0],
                    arriving_at: item[1],
                    num_flights: item[2],
                    flight_list: item[3],
                    earliest_arrival: item[4],
                    latest_arrival: item[5],
                    airplane_list: item[6],
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
            <h1>Flight in the Air</h1>

            {flights.length > 0 ? (

 
                <table className = "table">
                    <thead>
                        <tr>
                            <th>departing_from</th>
                            <th>arriving_at</th>
                            <th>num_flights</th>
                            <th>flight_list</th>
                            <th>earliest_arrival</th>
                            <th>latest_arrival</th>
                            <th>airplane_list</th>
                        </tr>
                    </thead>

                    <tbody>
                        {flights.map(flight => (
                            <tr key = {flight.departing_from + flight.arriving_at}>
                                <td>{flight.departing_from}</td>
                                <td>{flight.arriving_at}</td>
                                <td>{flight.num_flights}</td>
                                <td>{flight.flight_list}</td>
                                <td>{flight.earliest_arrival}</td>
                                <td>{flight.latest_arrival}</td>
                                <td>{flight.airplane_list}</td>
                            </tr>
                        ))}
                    </tbody>
                
                </table> 
                
            ) : (<p> No flights are in the air</p>)
            }
                
        </div>
    );
}

export default Flights_In_Air;