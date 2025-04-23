import React from 'react';
import {Link} from 'react-router-dom';

function NavigationRow() {
    return (
        <nav className = "navbar navbar-expand-lg navbar-light bg-light" style= {{display: 'flex', flexDirection: 'column'}}>
            <Link className= "navbar-brand" to ="/"> SAMS System </Link>
            <div className = "collapse navbar-collapse">
                <ul className = "navbar-nav mr-auto">
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/add_airplane"> Add Airplane</Link>
                    </li>
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/add_airport"> Add Airport</Link>
                    </li>
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/add_person"> Add Person</Link>
                    </li>
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/grant-or-revoke-pilot-license"> Grant or Revoke Pilot License</Link>
                    </li>
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/offer-flight"> Offer Flight</Link>
                    </li>
                    {/* add functions as you go */}

                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/flight_landing"> Flight Landing</Link>
                    </li>
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/flight_takeoff"> Flight Takeoff</Link>
                    </li>
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/flights_in_the_air"> Flights in the Air</Link>
                    </li>
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/flights_on_the_ground"> Flights on the Ground</Link>
                    </li>
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/passengers_board"> Passengers Board</Link>
                    </li>
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/passengers_disembark"> Passengers Disembark</Link>
                    </li>
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/route_summary"> Route Summary</Link>
                    </li>
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/alternative_airports"> Alternative Airports</Link>
                    </li>
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/people_on_the_ground"> People on the Ground</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default NavigationRow;