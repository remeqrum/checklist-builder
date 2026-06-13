import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard } from './components/dashboard/Dashboard';
import { Builder } from './components/builder/Builder';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/checklist/:id" element={<Builder />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
