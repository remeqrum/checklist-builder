import { useEffect } from 'react';
import { useChecklistStore } from './store/checklistStore';
import { Dashboard } from './components/dashboard/Dashboard';
import { Builder } from './components/builder/Builder';

function App() {
  const { activeChecklistId, loadFromStorage } = useChecklistStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (activeChecklistId) {
    return <Builder />;
  }

  return <Dashboard />;
}

export default App;
