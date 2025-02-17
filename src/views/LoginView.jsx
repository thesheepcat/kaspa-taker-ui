import React from "react";
import LoginForm from "../components/Login/LoginForm.jsx";
import {checkKaspaNodeConnection} from "../utils/checkKaspaNodeConnection.js";
import {Button} from '@mui/material';

const LoginView = () => {      
    const handleCheckKaspaNodeConnection = () => {
        checkKaspaNodeConnection();
    }
    return(
        <>
            <LoginForm />
            <Button
              variant="contained"  
              onClick={handleCheckKaspaNodeConnection}
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
              Get Kaspa node connection
            </Button>
        </>
    );
};

export default LoginView;
