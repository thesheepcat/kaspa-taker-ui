import React from "react";
import LoginForm from "../components/Login/LoginForm.jsx";
import  {redeemP2shUtxo} from "../utils/transactions.js";
import {Button} from '@mui/material';

const LoginView = () => {      
    const handleSpendP2shUtxo = async () => {
        await redeemP2shUtxo();
    }

    return(
        <>
            <LoginForm />

            <Button
                  variant="contained"                
                  onClick={handleSpendP2shUtxo}
                  sx={{              
                    width: '200px',
                    mx: 'auto',
                    mb: 3,
                    py: 1.5,
                    bgcolor: '#6fc7b7',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: '#6fc7b7',
                    }
                  }}
                >
                  Spend P2SH UTXO
                </Button>
        </>
    );
};

export default LoginView;
