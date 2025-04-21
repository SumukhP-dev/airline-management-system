import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import NavigationRow from "./components/NavigationRow";
import Add_Airplane from "./components/Add_Airplane";
import Add_Airport from "./components/Add_Airport";
import Add_Person from "./components/Add_Person";
import Grant_Or_Revoke_Pilot_License from "./components/Grant_Or_Revoke_Pilot_License";
import Offer_Flight from "./components/Offer_Flight";
import Flight_Landing from "./components/Flight_Landing";
import Flight_Takeoff from "./components/Flight_Takeoff";
import Flights_In_Air from "./components/Flights_In_Air";
import Flights_On_Ground from "./components/Flights_On_Ground";
import Recycle_Crew from "./components/Recycle_Crew";
import Retire_Flight from "./components/Retire_Flight";
import Simulation_Cycle from "./components/Simulation_Cycle";
import Assign_Pilot from "./components/Assign_Pilot";

function App() {
  return (
    <Router>
      <NavigationRow />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1></h1>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Link to="/add_airplane" style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary btn-lg">
                      Add Airplane
                    </button>
                  </Link>
                  <Link to="/add_airport" style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary btn-lg">
                      Add Airport
                    </button>
                  </Link>
                  <Link
                    to="/grant-or-revoke-pilot-license"
                    style={{ textDecoration: "none" }}
                  >
                    <button className="btn btn-primary btn-lg">
                      Grant or Revoke Pilot License
                    </button>
                  </Link>
                  <Link to="/offer-flight" style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary btn-lg">
                      Offer Flight
                    </button>
                  </Link>
                  <Link to="/add_person" style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary btn-lg">
                      Add Person
                    </button>
                  </Link>
                  <Link to="/flight_landing" style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary btn-lg">
                      Flight Landing
                    </button>
                  </Link>
                  <Link to="/flight_takeoff" style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary btn-lg">
                      Flight Takeoff
                    </button>
                  </Link>
                  <Link
                    to="/flights_in_the_air"
                    style={{ textDecoration: "none" }}
                  >
                    <button className="btn btn-primary btn-lg">
                      Flights in the Air
                    </button>
                  </Link>
                  <Link
                    to="/flights_on_the_ground"
                    style={{ textDecoration: "none" }}
                  >
                    <button className="btn btn-primary btn-lg">
                      Flights on the Ground
                    </button>
                  </Link>
                  <Link to="/recycle_crew" style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary btn-lg">
                      Recycle Crew
                    </button>
                  </Link>
                  <Link to="/retire_flight" style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary btn-lg">
                      Retire Flight
                    </button>
                  </Link>
                  <Link
                    to="/simulation_cycle"
                    style={{ textDecoration: "none" }}
                  >
                    <button className="btn btn-primary btn-lg">
                      Simulation Cycle
                    </button>
                  </Link>
                  <Link to="/assign_pilot" style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary btn-lg">
                      Assign Pilot
                    </button>
                  </Link>
                </div>
              </div>
            }
          />

          <Route path="/add_airplane" element={<Add_Airplane />} />
          <Route path="/add_airport" element={<Add_Airport />} />
          <Route
            path="/grant-or-revoke-pilot-license"
            element={<Grant_Or_Revoke_Pilot_License />}
          />
          <Route path="/offer-flight" element={<Offer_Flight />} />
          <Route path="/add_person" element={<Add_Person />} />
          <Route path="/flight_landing" element={<Flight_Landing />} />
          <Route path="/flight_takeoff" element={<Flight_Takeoff />} />
          <Route path="/flights_in_the_air" element={<Flights_In_Air />} />
          <Route
            path="/flights_on_the_ground"
            element={<Flights_On_Ground />}
          />
          <Route path="/recycle_crew" element={<Recycle_Crew />} />
          <Route path="/retire_flight" element={<Retire_Flight />} />
          <Route path="/assign_pilot" element={<Assign_Pilot />} />
          <Route path="/simulation_cycle" element={<Simulation_Cycle />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
