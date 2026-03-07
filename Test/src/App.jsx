import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecordForm from './pages/RecordForm';

function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<RecordForm />} />
          <Route path="/edit/:id" element={<RecordForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
