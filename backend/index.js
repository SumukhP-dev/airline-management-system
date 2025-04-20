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
    if (error)
      return res.status(500).json({ message: "Flights in the air failure" });
    res.status(200).json({ message: "Flights in the air success" });

    return data;
  });
});

app.get("/flights_on_the_ground", (req, res) => {
  const query = "select * from flights_on_the_ground";

  db.query(query, (error, data) => {
    if (error)
      return res.status(500).json({ message: "Flights in the ground failure" });
    res.status(200).json({ message: "Flights in the ground success" });

    return data;
  });
});

app.get("/people_in_the_air", (req, res) => {
  const query = "select * from people_in_the_air";

  db.query(query, (error, data) => {
    if (error)
      return res.status(500).json({ message: "People in the ground failure" });
    res.status(200).json({ message: "People in the ground success" });

    return data;
  });
});

app.get("/people_in_the_ground", (req, res) => {
  const query = "select * from people_in_the_ground";

  db.query(query, (error, data) => {
    if (error)
      return res.status(500).json({ message: "People in the ground failure" });
    res.status(200).json({ message: "People in the ground success" });

    return data;
  });
});

app.get("/route_summary", (req, res) => {
  const query = "select * from route_summary";

  db.query(query, (error, data) => {
    if (error)
      return res.status(500).json({ message: "Route summary failure" });
    res.status(200).json({ message: "Route summary success" });

    return data;
  });
});

app.get("/alternative_airports", (req, res) => {
  const query = "select * from alternative_airports";

  db.query(query, (error, data) => {
    if (error)
      return res.status(500).json({ message: "Alternative airports failure" });
    res.status(200).json({ message: "Alternative airports success" });

    return data;
  });
});

// Add catch-all route to serve React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(8800, () => {
  console.log("Backend running on http://localhost:8800");
});
