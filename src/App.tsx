import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import VulnerabilityListPage from './pages/VulnerabilityListPage';
import VulnerabilityDetailPage from './pages/VulnerabilityDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vulnerabilities" element={<VulnerabilityListPage />} />
          <Route path="/vulnerabilities/:cveId" element={<VulnerabilityDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

