import React from 'react';
import {Link} from 'react-router-dom';

function NavigationRow() {
    return (
        <nav className = "navbar navbar-expand-lg navbar-light bg-light">
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
                    <li className = "nav-item">
                        <Link className= "nav-link" to = "/flights-in-air"> Flights in Air</Link>
                    </li>
                    {/* add functions as you go */}
                </ul>
            </div>
        </nav>
    )
}

export default NavigationRow;