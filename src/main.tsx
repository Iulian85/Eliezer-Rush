import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// The manifest URL must be absolute or relative to the root. 
// Since we added tonconnect-manifest.json to the root, we can point to it.
const manifestUrl = new URL('tonconnect-manifest.json', window.location.href).toString();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
        <App />
    </TonConnectUIProvider>
  </React.StrictMode>
)