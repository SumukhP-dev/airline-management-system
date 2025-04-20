import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import NavigationRow from './components/NavigationRow';
import Add_Airplane from './components/Add_Airplane';
import Add_Airport from './components/Add_Airport';
import Add_Person from './components/Add_Person';
<<<<<<< Updated upstream
import Grant_Or_Revoke_Pilot_License from './components/Grant_Or_Revoke_Pilot_License';
import Offer_Flight from './components/Offer_Flight';
=======
import Flight_Landing from './components/Flight_Landing';
import Flight_Takeoff from './components/Flight_Takeoff';
>>>>>>> Stashed changes
import Flights_In_Air from './components/Flights_In_Air';

function App() {
  return (
    
    <Router>
      <NavigationRow />
      <div className = "container">
        <Routes>
          <Route path = "/"
            element = {
              <div>
                <h1>
                   

                </h1>
                <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center',  gap: '10px'}}>
                  <Link to = "/add_airplane" style = {{ textDecoration: "none"}}>
                    <button className="btn btn-primary btn-lg" >Add Airplane</button>
                  </Link>
                  <Link to = "/add_airport" style = {{ textDecoration: "none"}}>
                    <button className="btn btn-primary btn-lg" >Add Airport</button>
                  </Link>
                  <Link to = "/add_person" style = {{ textDecoration: "none"}}>
                    <button className="btn btn-primary btn-lg" >Add Person</button>
                  </Link>
                  <Link to = "/flight_landing" style = {{ textDecoration: "none"}}>
                    <button className="btn btn-primary btn-lg" >Flight Landing</button>
                  </Link>
                  <Link to = "/flight_takeoff" style = {{ textDecoration: "none"}}>
                    <button className="btn btn-primary btn-lg" >Flight Takeoff</button>
                  </Link>
                  <Link to = "/flights_in_the_air" style = {{ textDecoration: "none"}}>
                    <button className="btn btn-primary btn-lg" >Flights in the Air</button>
                  </Link>
                </div>



              </div>
            }
            />

          <Route path ="/add_airplane" element = {<Add_Airplane />}/>
          <Route path ="/add_airport" element = {<Add_Airport />}/>
          <Route path ="/add_person" element = {<Add_Person />}/>
<<<<<<< Updated upstream
          <Route path ="/grant-or-revoke-pilot-license" element = {<Grant_Or_Revoke_Pilot_License />}/>
          <Route path ="/offer-flight" element = {<Offer_Flight />}/>
          <Route path ="/flights-in-air" element = {<Flights_In_Air />}/>
=======
          <Route path ="/flight_landing" element = {<Flight_Landing />}/>
          <Route path ="/flight_takeoff" element = {<Flight_Takeoff />}/>
          <Route path ="/flights_in_the_air" element = {<Flights_In_Air />}/>
>>>>>>> Stashed changes
        </Routes>
      </div>


      
      
    </Router>
  );
}

export default App;