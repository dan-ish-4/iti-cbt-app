import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assuming you have a global css file
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <AuthProvider> {/* Wrap the App component */}
          <App />
        </AuthProvider>
  </React.StrictMode>
);

