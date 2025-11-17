
import React, { useState } from 'react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  correctPassword: string;
}

const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);


const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, correctPassword }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onLoginSuccess();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-slate-800 shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4 border border-slate-700">
        <div className="mb-6 text-center">
            <div className="inline-block bg-sky-500/20 text-sky-400 p-3 rounded-full mb-4">
                <LockIcon className="w-8 h-8"/>
            </div>
          <h1 className="text-2xl font-bold text-slate-100">Access Required</h1>
          <p className="text-slate-400 mt-1">Enter the password to continue.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border border-slate-600 rounded w-full py-3 px-4 bg-slate-700 text-slate-200 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-sky-500"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-xs italic mb-4">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
              type="submit"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
