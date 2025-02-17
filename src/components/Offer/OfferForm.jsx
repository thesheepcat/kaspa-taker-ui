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
import { SwapType, getOfferRequestByPrice, getOfferRequestByAmount, getDataFromMaker } from "../../utils/communication.js";
import { GeneralContext } from "../ContextProviders/GeneralContextProvider.jsx";
import { useNavigate } from 'react-router-dom';

const KAS = {
  name: "Kaspa",
  symbol: "KAS"
}

const BTC = {
  name: "Bitcoin",
  symbol: "Satoshi"
}

const OfferForm = () => {
  const navigate = useNavigate();
  const { 
    privateKey, 
    setPrivateKey, 
    publicKey, 
    setPublicKey, 
    makerAddress, 
    receivingAmount, 
    setReceivingAmount, 
    priceForMaker, 
    setPriceForMaker,
    swapType,
    setSwapType
  } = useContext(GeneralContext);
  const [amount, setAmount] = useState("");
  
  const [fromCoin, setFromCoin] = useState(BTC);
  const [toCoin, setToCoin] = useState(KAS);
  const [exchangeRate, setExchangeRate] = useState(null);  
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);

  const handleAmount = (amount) => {
    setReceivingAmount("");
    setExchangeRate("");
    setAmount(amount);
  }

  const handleSwitchCoins = () => {
    setReceivingAmount("");
    setExchangeRate("");
    setFromCoin(toCoin);
    setToCoin(fromCoin);    
    setSwapType((swapType) => {
      if (swapType == SwapType.SAT2KAS) {
        return SwapType.KAS2SAT;
      } else {
        return SwapType.SAT2KAS;
      }
    });
    console.log("swapType")
        console.log(swapType)
  };

  const getOfferFromMaker = async () => {
    console.log(privateKey);
    console.log(publicKey);
    //TODO
    /* 
    const privkey = 'b7e151628aed2a6abf7158809cf4f3c762e7160f38b4da56a784d9045190cfef';
    const pubkey = 'dff1d77f2a671c5f36183726db2341be58feae1da2deced843240f7b502ba659';
    const privateKey = new PrivateKey(privkey);
    const publicKey = new PublicKey(pubkey);
    */
    
    const offerRequest = getOfferRequestByAmount(swapType, amount, privateKey, publicKey);    
    const response = await getDataFromMaker(offerRequest, makerAddress);
    console.log("response");
    console.log(response);
    const receivingAmount = response["amount"];
    setReceivingAmount(receivingAmount);
    setExchangeRate(receivingAmount/amount);
    const offerValidity = response["valid_until"];
    const priceFromMaker = response["price"];
    setPriceForMaker(priceFromMaker);
  }

  const handleGetOffer = async () => {
    // In a real app, you would fetch the current exchange rate here
    setIsLoadingOffer(true);
    await getOfferFromMaker();
    setIsLoadingOffer(false);
  };

  const handleStartSwap = () => {
    navigate('/swap');
  }

  
return (
    <Container  sx={{ mt: 5, mb: 5, width:"650px" }}>
      <Box elevation={3} sx={{
        padding: "30px",
        borderRadius: 2,
        boxShadow: '0 0 20px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Get offer
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
                label="Amount"
                name="amount"
                type="number"
                value={amount}
                onChange={(e) => handleAmount(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      { fromCoin.symbol }
                    </InputAdornment>
                  ),
                }}
          />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <TextField
                fullWidth
                label="From"
                name="from"
                value={fromCoin.name}
                InputProps={{
                  readOnly: true 
                }}
              />
            </Grid>
            
            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton 
                onClick={handleSwitchCoins}
                aria-label="switch coins"
                sx={{ 
                  bgcolor: '#6fc7b7', 
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#707579'
                  }
                }}
              >
                <SwapHorizIcon />
              </IconButton>
            </Grid>
            
            <Grid item xs={5}>
            <TextField
                fullWidth
                label="To"
                name="to"
                value={toCoin.name}
                InputProps={{
                  readOnly: true 
                }}
              />
            </Grid>
          </Grid>
          <TextField                
                fullWidth
                label="Maker address"
                name="makerAddress"
                value={makerAddress}
                InputProps={{
                  readOnly: true 
                }}
          />        
          {amount !== "" && (
            <Button
              variant="contained"  
              onClick={handleGetOffer}
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
              {isLoadingOffer ? <CircularProgress size={24} color="inherit" /> : 'Get offer'}
            </Button>
          )}
          
          {receivingAmount !== "" && (
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
              </Box>
              <Button
                variant="contained"                
                onClick={handleStartSwap}
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
                Start swap
              </Button>
              
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default OfferForm;