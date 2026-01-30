import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Solutions from './pages/Solutions';
import Agents from './pages/Agents';
import About from './pages/About';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import ImageGenerator from './components/ImageGenerator';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/image-generator" element={<ImageGenerator />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
