import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Revenue from './pages/Revenue';
import Academics from './pages/Academics';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/academics" element={<Academics />} />
      </Routes>
    </Layout>
  );
}

export default App;
