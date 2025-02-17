import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from "@mui/material/styles";
import theme from "./index.theme.js";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
);