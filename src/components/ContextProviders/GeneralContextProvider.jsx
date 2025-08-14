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
    //const [makerAddress, setMakerAddress] = useState("http://ote3lmteti32gj7ogcoyr5w3cvhwintem6ukhowmbhbqqha4q7htinid.onion/");
    const [makerAddress, setMakerAddress] = useState("http://exlg6u3252bnzit7mgia3tpb2yctafmo3wbev72pwmxeqg7jiywsx2yd.onion/");
    const [swapType, setSwapType] = useState(SwapType.SAT2KAS);
    const [priceForMaker, setPriceForMaker] = useState(0);
    const [receivingAmount, setReceivingAmount] = useState("");
    const [derivedP2shAddress, setDerivedP2shAddress] = useState(null);

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
        setSwapType: setSwapType,
        derivedP2shAddress : derivedP2shAddress,
        setDerivedP2shAddress: setDerivedP2shAddress
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