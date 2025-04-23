import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

function People_On_The_Ground() {
    const[people_on_the_ground, setPeople_on_the_ground] = useState(['']);    

    const[error, setError] = useState(null);

    useEffect(() => {
        const fetchPeople_on_the_ground = async () => {
            try {
                const response = await fetch('http://localhost:8800/people_on_the_ground');

                if(!response.ok) {
                    throw new Error('Fetch people_on_the_ground failed');
                }

                const data = await response.json();

                const getPeople_on_the_ground = data.result.map(item => ({
                    departing_from: item[0],
                    airport: item[1],
                    airport_name: item[2],
                    city: item[3],
                    state: item[4],
                    country: item[5],
                    num_pilots: item[6],
                    num_passengers: item[7],
                    joint_pilots_passengers: item[8],
                    person_list: item[9],
                }));

                setPeople_on_the_ground(getPeople_on_the_ground);
               
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPeople_on_the_ground();
        
    }, []);

    if (error) {
        return <div> Error: {error}</div>;
    }

    return(
        <div className="container mt-4">
            <h1>People On The Ground</h1>
            {people_on_the_ground.length > 0 ? (
 
                <table className = "table">
                    <thead>
                        <tr>
                            <th>departing_from</th>
                            <th>airport</th>
                            <th>airport_name</th>
                            <th>city</th>
                            <th>state</th>
                            <th>country</th>
                            <th>num_pilots</th>
                            <th>num_passengers</th>
                            <th>joint_pilots_passengers</th>
                            <th>person_list</th>
                        </tr>
                    </thead>

                    <tbody>
                        {people_on_the_ground.map(people_on_the_ground => (
                            <tr key = {people_on_the_ground.departing_from + people_on_the_ground.airport}>
                                <td>{people_on_the_ground.departing_from}</td>
                                <td>{people_on_the_ground.airport}</td>
                                <td>{people_on_the_ground.airport_name}</td>
                                <td>{people_on_the_ground.city}</td>
                                <td>{people_on_the_ground.state}</td>
                                <td>{people_on_the_ground.country}</td>
                                <td>{people_on_the_ground.num_pilots}</td>
                                <td>{people_on_the_ground.num_passengers}</td>
                                <td>{people_on_the_ground.joint_pilots_passengers}</td>
                                <td>{people_on_the_ground.person_list}</td>
                            </tr>
                        ))}
                    </tbody>
                
                </table> 
                
            ) : (<p> No people on the ground</p>)
            }
                
        </div>
    );
}

export default People_On_The_Ground;
    