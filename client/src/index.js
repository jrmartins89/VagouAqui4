import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Renderiza o componente principal (App) no elemento com id 'root'
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
