import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  IconButton,
  Paper,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Keypair, PrivateKey, PublicKey, Address, NetworkType, createAddress } from "../../kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import { GeneralContext } from "../ContextProviders/GeneralContextProvider.jsx";
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const { privateKey, setPrivateKey, publicKey, setPublicKey, makerAddress, setUserAddress } = useContext(GeneralContext);
  const [privateKeyString, setPrivateKeyString] = useState("");
  const [publicKeyString, setPublicKeyString] = useState("");
  const [userAddressString, setUserAddressString] = useState("");

  const handleGenerateNewKeys = () => {
    const userKeyPair = new Keypair.random();
    console.log(userKeyPair);
    const privateKey = userKeyPair.privateKey;
    setPrivateKey(privateKey);
    const privateKeyString = privateKey.toString();
    setPrivateKeyString(privateKeyString);
    const publicKey = userKeyPair.xOnlyPublicKey;
    setPublicKey(publicKey);
    const publicKeyString = publicKey.toString();
    setPublicKeyString(publicKeyString);
    const userAddress = userKeyPair.toAddress(NetworkType.Mainnet);
    setUserAddress(userAddress);
    const userAddressString = userAddress.toString();
    setUserAddressString(userAddressString);
  }

  const handleMoveToOfferView = () => {
    navigate("/offer");
  }
return (
    <Container  sx={{ mt: 5, mb: 5, width:"800px" }}>
      <Box elevation={3} sx={{
        padding: "30px",
        borderRadius: 2,
        boxShadow: '0 0 20px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Login to KaspaSwap
        </Typography>
        <Box sx={{ 
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          padding: "30px",
          margin: "20px auto"
        }}>
          <Button
                variant="contained"                
                onClick={handleGenerateNewKeys}
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
                Generate new keys
              </Button>
            <TextField                
                  fullWidth
                  label="Private key"
                  name="privateKey"
                  value={privateKeyString}
                  InputProps={{
                    readOnly: true
                  }}
            />
            <TextField                
                  fullWidth
                  label="Public key"
                  name="publicKey"
                  value={publicKeyString}
                  InputProps={{
                    readOnly: true
                  }}
            />
            <TextField                
                  fullWidth
                  label="User address"
                  name="userAddress"
                  value={userAddressString}
                  InputProps={{
                    readOnly: true
                  }}
            />
            <Button
                variant="contained"                
                onClick={handleMoveToOfferView}
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
                Start swapping!
              </Button>  
        </Box>  
      </Box>
    </Container>
  );
}

export default LoginForm;