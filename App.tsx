
import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import AgentForm from './components/AgentForm';

// In a real application, this would be handled more securely.
const CORRECT_PASSWORD = 'hunar-ai-demo';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      {isAuthenticated ? (
        <AgentForm />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} correctPassword={CORRECT_PASSWORD} />
      )}
    </div>
  );
};

export default App;
