import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import VulnerabilityListPage from './pages/VulnerabilityList';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vulnerabilities" element={<VulnerabilityListPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

