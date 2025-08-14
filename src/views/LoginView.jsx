import React from "react";
import LoginForm from "../components/Login/LoginForm.jsx";
import  {redeemP2shUtxo} from "../utils/transactions.js";
import {Button} from '@mui/material';

const LoginView = () => {      
    return(
        <>
          <LoginForm />
        </>
    );
};

export default LoginView;
