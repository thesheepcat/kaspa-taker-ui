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
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Keypair, PrivateKey, PublicKey } from "../../kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import { SwapType, getSat2kasInitSwapRequest, getDataFromMaker } from "../../utils/communication.js";
import { GeneralContext } from "../ContextProviders/GeneralContextProvider.jsx";

const KAS = {
  name: "Kaspa",
  symbol: "KAS"
}

const BTC = {
  name: "Bitcoin",
  symbol: "Satoshi"
}

const Kas2SatSwapForm = () => {
  const { privateKey, setPrivateKey, publicKey, setPublicKey, makerAddress, receivingAmount, setReceivingAmount, priceForMaker } = useContext(GeneralContext);
  const [receivingAddress, setReceivingAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [fromCoin, setFromCoin] = useState(BTC);
  const [toCoin, setToCoin] = useState(KAS);
  const [swapType, setSwapType] = useState(SwapType.SAT2KAS);
  const [exchangeRate, setExchangeRate] = useState(null);  
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);

  const handleReceivingAddress = (value) => {
    setReceivingAddress(value);
  }

  const handleSwapCurrencies = () => {
    setReceivingAmount("");
    setExchangeRate("");
    setFromCoin(toCoin);
    setToCoin(fromCoin);
    setSwapType((swapType) => {
      if (swapType == SwapType.SAT2KAS) {
        setSwapType(SwapType.KAS2SAT)
      } else {
        setSwapType(SwapType.SAT2KAS)
      }
    });
  };

  const initizalizeSwapWithMaker = async () => {    
    const privkey = 'b7e151628aed2a6abf7158809cf4f3c762e7160f38b4da56a784d9045190cfef';
    const pubkey = 'dff1d77f2a671c5f36183726db2341be58feae1da2deced843240f7b502ba659';
    const privateKey = new PrivateKey(privkey);
    const publicKey = new PublicKey(pubkey);
    
    const initilizeSat2KasSwapRequest = getSat2kasInitSwapRequest(receivingAddress, receivingAmount, priceForMaker, privateKey, publicKey);
    const response = await getDataFromMaker(initilizeSat2KasSwapRequest, makerAddress);
    console.log("response");
    console.log(response);
  }

  const handleGetOffer = async () => {
    setIsLoadingOffer(true);
    await initizalizeSwapWithMaker();
    setIsLoadingOffer(false);
  };

  
return (
    <Container  sx={{ mt: 5, mb: 5, width:"650px" }}>
      <Box elevation={3} sx={{
        padding: "30px",
        borderRadius: 2,
        boxShadow: '0 0 20px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Swap your Kaspa with Bitcoin
        </Typography>
        <Box sx={{ 
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          padding: "30px",
          margin: "20px auto"
        }}>
          <TextField                
                fullWidth
                label="Receiving address"
                name="receivingAddress"
                value={receivingAddress}
                onChange={(e) => handleReceivingAddress(e.target.value)}
          />          
            <Box sx={{ 
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}>
              <Box sx={{ 
                display: "flex",
                flexDirection: "row",
                gap: "50px"
              }}>
              <TextField
                fullWidth
                label="Receiving amount"
                name="receiving"
                value={receivingAmount}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      { toCoin.symbol }
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Exchange rate"
                name="exchangeRate"
                value={exchangeRate}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      { toCoin.symbol } / { fromCoin.symbol }
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Price for maker"
                name="priceForMaker"
                value={priceForMaker}
              />
              </Box>
              <Button
                variant="contained"                
                onClick={initizalizeSwapWithMaker}
                disabled={isLoadingOffer}
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
                {isLoadingOffer ? <CircularProgress size={24} color="inherit" /> : 'Initialize swap'}
              </Button>
            </Box>  
        </Box>  
      </Box>
    </Container>
  );
}

export default Kas2SatSwapForm;