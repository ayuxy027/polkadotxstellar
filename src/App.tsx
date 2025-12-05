import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { WalletProvider } from "./wallet/WalletContext";
import FetchWalletInfo from "./components/FetchWalletInfo";

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<LandingPage />} />
          <Route path="/reputation" element={<Dashboard />} />
          <Route path="/about" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wallet-info" element={<FetchWalletInfo />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
