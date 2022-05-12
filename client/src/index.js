import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root')
const root = createRoot(container)

// USE STRICT RERENDERS COMPONENTS TWICE CAUSING ISSUES WITH INITIALISING HANDS
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)