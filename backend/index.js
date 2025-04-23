import express from "express";
import mysql from "mysql";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Add CORS support
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "317931",
  database: "flight_tracking",
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.json());

app.post("/add-airplane", (req, res) => {
  const sanitize = {
    str: (v) =>
      typeof v === "string" ? v.trim().replace(/^['"]+|['"]+$/g, "") : null,
    num: (v) => (isNaN(parseInt(v)) ? null : parseInt(v)),
    bool: (v) =>
      v === true || v === "true"
        ? true
        : v === false || v === "false"
        ? false
        : null,
  };

  const {
    airlineId,
    tailNum,
    seatCap,
    speed,
    locationId,
    planeType,
    maintained,
    model,
    neo,
  } = req.body;

  const values = [
    sanitize.str(airlineId),
    sanitize.str(tailNum),
    sanitize.num(seatCap),
    sanitize.num(speed),
    sanitize.str(locationId),
    sanitize.str(planeType),
    sanitize.bool(maintained),
    sanitize.str(model),
    sanitize.bool(neo),
  ];

  if (values.slice(0, 6).includes(null) || values[8] === null) {
    return res
      .status(400)
      .json({ error: "Missing or invalid required fields" });
  }

  db.query("CALL add_airplane(?, ?, ?, ?, ?, ?, ?, ?, ?)", values, (err) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to add airplane" });
    }
    res.status(200).json({ message: "Airplane added successfully" });
  });
});

app.post("/add-airport", (req, res) => {
  const sanitize = {
    str: (v) =>
      typeof v === "string" ? v.trim().replace(/^['"]+|['"]+$/g, "") : null,
  };

  const { airportCode, airportName, city, state, country, locationId } =
    req.body;

  const values = [
    sanitize.str(airportCode),
    sanitize.str(airportName),
    sanitize.str(city),
    sanitize.str(state),
    sanitize.str(country),
    sanitize.str(locationId),
  ];

  if (values.includes(null)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid required fields" });
  }

  db.query("CALL add_airport(?, ?, ?, ?, ?, ?)", values, (err) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to add airport" });
    }
    res.status(200).json({ message: "Airport added successfully" });
  });
});

app.post("/grant-or-revoke-pilot-license", (req, res) => {
  const sanitize = {
    str: (v) =>
      typeof v === "string" ? v.trim().replace(/^['"]+|['"]+$/g, "") : null,
  };

  const { personId, license } = req.body;

  const values = [sanitize.str(personId), sanitize.str(license)];

  db.query("CALL grant_or_revoke_pilot_license(?, ?)", values, (err) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to add airplane" });
    }
    res.status(200).json({ message: "License granted/revoked successfully" });
  });
});

app.post("/offer-flight", (req, res) => {
  const sanitize = {
    str: (v) =>
      typeof v === "string" ? v.trim().replace(/^['"]+|['"]+$/g, "") : null,
    num: (v) => (isNaN(parseInt(v)) ? null : parseInt(v)),
  };

  const {
    flightId,
    routeId,
    support_airline,
    support_tail,
    progress,
    nextTime,
    cost,
  } = req.body;

  const values = [
    sanitize.str(flightId),
    sanitize.str(routeId),
    sanitize.str(support_airline),
    sanitize.str(support_tail),
    sanitize.num(progress),
    nextTime,
    sanitize.num(cost),
  ];
  db.query("CALL offer_flight(?, ?, ?, ?, ?, ?, ?)", values, (err) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to add flight" });
    }
    res.status(200).json({ message: "Flight added successfully" });
  });
});

app.get("/", (request, res) => {
  res.json("hello this is the backend!");
});

app.get("/airplane", (request, res) => {
  const q = "SELECT * FROM airplane";
  db.query(q, (error, data) => {
    if (error) {
      return res.json(error);
    } else {
      return res.json(data);
    }
  });
});

app.get("/airport", (request, res) => {
  const q = "SELECT * FROM airport";
  db.query(q, (error, data) => {
    if (error) {
      return res.json(error);
    } else {
      return res.json(data);
    }
  });
});

app.post("/assign_pilot", (req, res) => {
  const { ip_flightID, ip_personID } = req.body;
  const query = "CALL assign_pilot(?, ?)";

  db.query(query, [ip_flightID, ip_personID], (error) => {
    if (error) return res.status(500).json({ error: "Failed to assign pilot" });
    res.status(200).json({ message: "Assign pilot success" });
  });
});

app.post("/recycle_crew", (req, res) => {
  const { ip_flightID } = req.body;
  const query = "CALL recycle_crew(?)";

  db.query(query, [ip_flightID], (error) => {
    if (error) return res.status(500).json({ error: "Failed to recycle crew" });
    res.status(200).json({ message: "Recycle crew success" });
  });
});

app.post("/retire_flight", (req, res) => {
  const { ip_flightID } = req.body;
  const query = "CALL retire_flight(?)";

  db.query(query, [ip_flightID], (error) => {
    if (error)
      return res.status(500).json({ error: "Failed to retire flight" });
    res.status(200).json({ message: "Retire flight success" });
  });
});

app.post("/simulation_cycle", (req, res) => {
  const query = "CALL simulation_cycle()";

  db.query(query, (error) => {
    if (error)
      return res.status(500).json({ error: "Failed to do simulation cycle" });
    res.status(200).json({ message: "Simulation cycle success" });
  });
});

app.get("/flights_in_the_air", (req, res) => {
  const query = "select * from flights_in_the_air";

  db.query(query, (error, data) => {
    if (error) {
      return res.status(500).json({ message: error.message });
      //res.status(200).json({ message: "Flights in the air success" });
    }
    let result = [];

    for (let i = 0; i < data.length; i++) {
      result.push([
        data[i].departing_from,
        data[i].arriving_at,
        data[i].num_flights,
        data[i].flight_list,
        data[i].earliest_arrival,
        data[i].latest_arrival,
        data[i].airplane_list,
      ]);
    }

    res.json({ result });
    //return result;
  });
});

app.get("/flights_on_the_ground", (req, res) => {
  const query = "select * from flights_on_the_ground";

  db.query(query, (error, data) => {
    if (error) {
      return res.status(500).json({ message: error.message });
      //res.status(200).json({ message: "Flights in the air success" });
    }

    let result = [];

    for (let i = 0; i < data.length; i++) {
      result.push([
        data[i].departing_from,
        data[i].num_flights,
        data[i].flight_list,
        data[i].earliest_arrival,
        data[i].latest_arrival,
        data[i].airplane_list,
      ]);
    }

    res.json({ result });
    //return result;
  });
});

app.get("/people_in_the_air", (req, res) => {
  const query = "select * from people_in_the_air";

  db.query(query, (error, data) => {
    if (error)
      return res.status(500).json({ message: "People in the ground failure" });
    res.status(200).json({ message: "People in the ground success" });

    let result = [];

    for (let i = 0; i < data.length; i++) {
      result.push([
        data[i].departing_from,
        data[i].arriving_at,
        data[i].num_airplanes,
        data[i].airplane_list,
        data[i].flight_list,
        data[i].earliest_arrival,
        data[i].latest_arrival,
        data[i].num_pilots,
        data[i].num_passengers,
        data[i].joint_pilots_passengers,
        data[i].persons_list,
      ]);
    }

    return result;
  });
});

app.get("/people_in_the_ground", (req, res) => {
  const query = "select * from people_in_the_ground";

  db.query(query, (error, data) => {
    if (error)
      return res.status(500).json({ message: "People in the ground failure" });
    res.status(200).json({ message: "People in the ground success" });

    let result = [];

    for (let i = 0; i < data.length; i++) {
      result.push([
        data[i].departing_from,
        data[i].Airport,
        data[i].airport_name,
        data[i].city,
        data[i].state,
        data[i].country,
        data[i].num_pilots,
        data[i].num_passengers,
        data[i].joint_pilots_passengers,
        data[i].person_list,
      ]);
    }

    return result;
  });
});

app.get("/route_summary", (req, res) => {
  const query = "select * from route_summary";
  db.query(query, (error, data) => {
    if (error)
      return res.status(500).json({ message: "Route summary failure" });

    let result = [];
    for (let i = 0; i < data.length; i++) {
      result.push([
        data[i].route,
        data[i].num_legs,
        data[i].leg_sequence,
        data[i].route_length,
        data[i].num_flights,
        data[i].flight_list,
        data[i].airport_sequence,
      ]);
    }
    res.status(200).json({ result });
  });
});

app.get("/alternative_airports", (req, res) => {
  const query = "select * from alternative_airports";

  db.query(query, (error, data) => {
    if (error)
      return res.status(500).json({ message: "Alternative airports failure" });

    let result = [];

    for (let i = 0; i < data.length; i++) {
      result.push([
        data[i].city,
        data[i].state,
        data[i].country,
        data[i].num_airports,
        data[i].airport_code_list,
        data[i].airport_names_list,
      ]);
    }

    res.status(200).json({ result });
  });
});

app.post("/add_person", (req, res) => {
  const sanitize = {
    str: (v) => (typeof v === "string" ? v.trim().replace(/^['"]+|['"]+$/g, "") : null),
    num: (v) => (isNaN(parseInt(v)) ? null : parseInt(v)),
  };
  const { personID, first_name, last_name, locationID, taxID, experience, miles, funds } = req.body;
  const values = [
    sanitize.str(personID),
    sanitize.str(first_name),
    sanitize.str(last_name),
    sanitize.str(locationID),
    sanitize.str(taxID),
    sanitize.num(experience),
    sanitize.num(miles),
    sanitize.num(funds),
  ];
  if (values.includes(null)) {
    return res.status(400).json({ error: "Missing or invalid required fields" });
  }
  db.query("CALL add_person(?, ?, ?, ?, ?, ?, ?, ?)", values, (err) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to add person" });
    }
    res.status(200).json({ message: "Person added successfully" });
  });
});

app.post("/flight_landing", (req, res) => {
  const { flightID } = req.body;
  if (!flightID) return res.status(400).json({ error: "Missing flightID" });
  db.query("CALL flight_landing(?)", [flightID], (err) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to land flight" });
    }
    res.status(200).json({ message: "Flight landed successfully" });
  });
});

app.post("/flight_takeoff", (req, res) => {
  const { flightID } = req.body;
  if (!flightID) return res.status(400).json({ error: "Missing flightID" });
  db.query("CALL flight_takeoff(?)", [flightID], (err) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to takeoff flight" });
    }
    res.status(200).json({ message: "Flight took off successfully" });
  });
});

app.post("/passengers_board", (req, res) => {
  const { flightID } = req.body;
  if (!flightID) return res.status(400).json({ error: "Missing flightID" });
  db.query("CALL passengers_board(?)", [flightID], (err) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to board passengers" });
    }
    res.status(200).json({ message: "Passengers boarded successfully" });
  });
});

app.post("/passengers_disembark", (req, res) => {
  const { flightID } = req.body;
  if (!flightID) return res.status(400).json({ error: "Missing flightID" });
  db.query("CALL passengers_disembark(?)", [flightID], (err) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to disembark passengers" });
    }
    res.status(200).json({ message: "Passengers disembarked successfully" });
  });
});

app.get("/people_on_the_ground", (req, res) => {
  const query = "select * from people_on_the_ground";
  db.query(query, (error, data) => {
    if (error)
      return res.status(500).json({ message: "People in the ground failure" });

    let result = [];
    for (let i = 0; i < data.length; i++) {
      result.push([
        data[i].departing_from,
        data[i].Airport,
        data[i].airport_name,
        data[i].city,
        data[i].state,
        data[i].country,
        data[i].num_pilots,
        data[i].num_passengers,
        data[i].joint_pilots_passengers,
        data[i].person_list,
      ]);
    }
    res.status(200).json({ result });
  });
});

app.listen(8800, () => {
  console.log("Backend running on http://localhost:8800");
});