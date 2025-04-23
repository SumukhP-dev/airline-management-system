import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

function Route_Summary() {
    const[route_summary, setRoute_summary] = useState(['']);    

    const[error, setError] = useState(null);

    useEffect(() => {
        const fetchRoute_summary = async () => {
            try {
                const response = await fetch('http://localhost:8800/route_summary');

                if(!response.ok) {
                    throw new Error('Fetch route_summary failed');
                }

                const data = await response.json();

                const getRoute_summary = data.result.map(item => ({
                    route: item[0],
                    num_legs: item[1],
                    leg_sequence: item[2],
                    route_length: item[3],
                    num_flights: item[4],
                    flight_list: item[5],
                    airplane_sequence: item[6],
                }));

                setRoute_summary(getRoute_summary);
               
            } catch (error) {
                setError(error.message);
            }
        };

        fetchRoute_summary();
        
    }, []);

    if (error) {
        return <div> Error: {error}</div>;
    }

    return(
        <div className="container mt-4">
            <h1>Route Summary</h1>
            {route_summary.length > 0 ? (
 
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
                        {route_summary.map(route_summary => (
                            <tr key = {route_summary.route + route_summary.num_legs}>
                                <td>{route_summary.route}</td>
                                <td>{route_summary.num_legs}</td>
                                <td>{route_summary.leg_sequence}</td>
                                <td>{route_summary.route_length}</td>
                                <td>{route_summary.num_flights}</td>
                                <td>{route_summary.flight_list}</td>
                                <td>{route_summary.airplane_sequence}</td>
                            </tr>
                        ))}
                    </tbody>
                
                </table> 
                
            ) : (<p> No route summary</p>)
            }
                
        </div>
    );
}

export default Route_Summary;
    


