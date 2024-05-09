import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/authContext.jsx';
import { ToastContainer } from 'react-toastify';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider> 
      <React.StrictMode>
        <App />
        <ToastContainer />
      </React.StrictMode>
    </AuthProvider>
  </BrowserRouter>,
)
