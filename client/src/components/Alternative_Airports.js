import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

function Alternative_Airports() {
    const[alternative_airports, setAlternative_airports] = useState(['']);    

    const[error, setError] = useState(null);

    useEffect(() => {
        const fetchAlternative_airports = async () => {
            try {
                const response = await fetch('http://localhost:8800/alternative_airports');

                if(!response.ok) {
                    throw new Error('Fetch alternative_airports failed');
                }

                const data = await response.json();

                const getAlternative_airports = data.result.map(item => ({
                    city: item[0],
                    state: item[1],
                    country: item[2],
                    num_airports: item[3],
                    airport_code_list: item[4],
                    airport_names_list: item[5],
                }));

                setAlternative_airports(getAlternative_airports);
               
            } catch (error) {
                setError(error.message);
            }
        };

        fetchAlternative_airports();
        
    }, []);

    if (error) {
        return <div> Error: {error}</div>;
    }

    return(
        <div className="container mt-4">
            <h1>Alternative Airports</h1>
            {alternative_airports.length > 0 ? (
 
                <table className = "table">
                    <thead>
                        <tr>
                            <th>city</th>
                            <th>state</th>
                            <th>country</th>
                            <th>num_airports</th>
                            <th>airport_code_list</th>
                            <th>airport_names_list</th>
                        </tr>
                    </thead>

                    <tbody>
                        {alternative_airports.map(alternative_airports => (
                            <tr key = {alternative_airports.city + alternative_airports.state}>
                                <td>{alternative_airports.city}</td>
                                <td>{alternative_airports.state}</td>
                                <td>{alternative_airports.country}</td>
                                <td>{alternative_airports.num_airports}</td>
                                <td>{alternative_airports.airport_code_list}</td>
                                <td>{alternative_airports.airport_names_list}</td>
                            </tr>
                        ))}
                    </tbody>
                
                </table> 
                
            ) : (<p> No alternative airports</p>)
            }
                
        </div>
    );
}

export default Alternative_Airports;
    
