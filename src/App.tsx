import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<LandingPage />} />
        <Route path="/pricing" element={<LandingPage />} />
        <Route path="/about" element={<LandingPage />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/signup" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;