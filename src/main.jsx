import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

console.log('VITE v4.5.14 ready in 3302 ms');
console.log('➜ Local: http://localhost:3001/');
console.log('➜ Network: use --host to expose');
console.log('➜ press h to show help');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
