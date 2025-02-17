import React from "react";
import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Keypair, PrivateKey, PublicKey } from "../../kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import loadKaspaSDK from "../../kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import { SwapType } from "../../utils/communication.js";

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {
    const [privateKey, setPrivateKey] = useState(null);
    const [publicKey, setPublicKey] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [makerAddress, setMakerAddress] = useState("http://ote3lmteti32gj7ogcoyr5w3cvhwintem6ukhowmbhbqqha4q7htinid.onion/");
    const [swapType, setSwapType] = useState(SwapType.SAT2KAS);
    const [priceForMaker, setPriceForMaker] = useState(0);
    const [receivingAmount, setReceivingAmount] = useState("");

    const loadKaspaWasm = async () => {
        await loadKaspaSDK();
    }

    useEffect(() => {
        loadKaspaWasm();
    }, [])
    
    const value = {
        privateKey: privateKey,
        setPrivateKey: setPrivateKey,
        publicKey: publicKey,
        setPublicKey: setPublicKey,
        userAddress: userAddress,
        setUserAddress: setUserAddress,
        makerAddress: makerAddress,
        setMakerAddress: setMakerAddress,
        receivingAmount: receivingAmount,
        setReceivingAmount: setReceivingAmount,
        priceForMaker: priceForMaker,
        setPriceForMaker: setPriceForMaker,
        swapType: swapType,
        setSwapType: setSwapType
    }

    return(
        <GeneralContext.Provider value={value}>
            {children}
        </GeneralContext.Provider>
    );
};

export default GeneralContextProvider;

GeneralContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};