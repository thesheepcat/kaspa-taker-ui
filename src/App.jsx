import React from 'react';
import { useEffect } from "react";
import OfferView from "./views/OfferView.jsx";
import HomeView from "./views/HomeView.jsx";
import SettingsView from "./views/SettingsView.jsx";
import SwapView from "./views/SwapView.jsx";
import LoginView from "./views/LoginView.jsx";
import loadKaspaSDK from "../src/kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import GeneralContextProvider from './components/ContextProviders/GeneralContextProvider.jsx';
import { HashRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./views/AppLayout.jsx";

const App = () => {
    return (
        <GeneralContextProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<HomeView/>} />
                    <Route path="/login" element={<LoginView/>} />
                    <Route path="/offer" element={<OfferView/>} />
                    <Route path="/swap" element={<SwapView/>} />
                    <Route path="/settings" element={<SettingsView/>} />
                </Routes>
            </HashRouter>
        </GeneralContextProvider>    
    )
};

export default App;