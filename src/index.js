import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Tailwind CSS styles
import App from './App';

// Create the root element for rendering the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main App component inside the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// No need for reportWebVitals, so it's removed
