# Airline Management System
A comprehensive airline management system built with React and Node.js for managing flights, airports, airplanes, and personnel.

---

## Features
- **Airplane Management**: Add and manage airplanes in the fleet
- **Airport Management**: Add and manage airports
- **Personnel Management**: Add staff and manage pilot licenses
- **Flight Operations**: 
  - Offer and schedule flights
  - Track flight takeoffs and landings
  - Monitor flights in air and on ground
  - Retire flights
- **Crew Management**: Assign pilots and recycle crew assignments
- **Passenger Management**: Handle passenger boarding and disembarking
- **Route Management**: View route summaries and find alternative airports
- **Simulation**: Run simulation cycles for system testing
- **Reporting**: Track people on the ground and generate reports

---

## Tech Stack
- **Frontend**: React 19.1.0, React Router DOM 7.5.1, Bootstrap 5.3.5
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Development Tools**: Create React App, Nodemon

---

## Project Structure
```
Phase4/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main application component
│   │   └── index.js       # Application entry point
│   └── package.json       # Frontend dependencies
├── backend/               # Node.js backend API
│   ├── index.js          # Backend server entry point
│   └── package.json      # Backend dependencies
└── database/             # SQL database scripts
    ├── cs4400_phase3_stored_procedures_team63.sql
    ├── cs4400_sams_phase3_autograder_BASIC_v0-final.sql
    └── cs4400_sams_phase3_database_v0-final.sql
```

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Phase4
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../client
   npm install
   ```

4. **Database Setup**:
   - Import the SQL files from the project root into your MySQL database
   - Update database connection settings in `backend/index.js`

### Running the Application

1. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```
   The backend will typically run on `http://localhost:5000`

2. **Start the frontend development server**:
   ```bash
   cd client
   npm start
   ```
   The frontend will run on `http://localhost:3000`

---

## Available Scripts

### Frontend (client/)
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Backend (backend/)
- `npm start` - Starts the backend server with nodemon
- `npm test` - Runs the test script (currently placeholder)

---

## License
MIT License

---

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request