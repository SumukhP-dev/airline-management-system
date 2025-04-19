import express from "express";
import mysql from "mysql";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "317931",
    database: "flight_tracking"
});

app.use(express.static(path.join(__dirname, "../client")));
app.use(express.json());

app.post("/add-airplane", (req, res) => {
    const { airlineId, tailNum, seatCap, speed, locationId, planeType, maintained, model, neo } = req.body;

    const query = "CALL add_airplane(?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    db.query(query, [airlineId, tailNum, seatCap, speed, locationId, planeType, maintained, model, neo], (error) => {
        if (error) return res.status(500).json({ error: "Failed to add airplane" });
        res.status(200).json({ message: "Airplane added successfully" });
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

app.listen(8800, () => {
    console.log("Backend running on http://localhost:8800");
});