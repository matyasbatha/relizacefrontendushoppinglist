import React from 'react';
import Dashboard from './components/Dashboard';

// hlavní entry point aplikace - tady se jenom renderuje Dashboard
function App() {
  console.log("App se renderuje");
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
