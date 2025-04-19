import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import NavigationRow from './components/NavigationRow';
import Add_Airplane from './components/Add_Airplane';
import Add_Airport from './components/Add_Airport';
import Add_Person from './components/Add_Person';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <Router>
      <NavigationRow />
      <div className = "container">
        <Routes>
          <Route path ="/add_airplane" element = {<Add_Airplane />}/>
          <Route path ="/add_airport" element = {<Add_Airport />}/>
          <Route path ="/add_person" element = {<Add_Person />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
