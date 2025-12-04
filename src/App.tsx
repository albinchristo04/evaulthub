import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MatchDetail from './pages/MatchDetail';

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/match/:id" element={<MatchDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
