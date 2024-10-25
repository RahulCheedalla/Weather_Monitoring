import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import DailyWeatherSummary from './Components/DailyWeatherSummary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/summary" element={<DailyWeatherSummary/>}/>
      </Routes>
    </Router>
  );
}

export default App;
