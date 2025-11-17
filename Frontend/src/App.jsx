// src/App.jsx
import './App.css';
import ActivityTracker from './Pages/ActivityTracker';

function App() {
  return (
    <div className="App">
      <ActivityTracker />
      {/* You would typically wrap your entire application content with this tracker component
          or integrate the logic into a custom hook that runs once per page view/route change. */}
    </div>
  );
}

export default App;