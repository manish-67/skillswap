import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// import './index.css'; // If you deleted this, keep it commented
import { UserProvider } from './context/UserContext.jsx'; // Import UserProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider> {/* Wrap App with UserProvider */}
      <App />
    </UserProvider>
  </React.StrictMode>,
);