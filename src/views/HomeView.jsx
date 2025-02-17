import React, { useContext } from "react";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeneralContext} from "../components/ContextProviders/GeneralContextProvider";

const HomeView = () => {
    const { privateKey } = useContext(GeneralContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (privateKey == null) {
            navigate("/login");
        } else {
            navigate('/offer'); 
        }
    }, [navigate]);

    return(
        <>
        </>
    );
};

export default HomeView;