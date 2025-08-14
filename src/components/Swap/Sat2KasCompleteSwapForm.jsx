import React, { useState, useEffect, useContext } from "react";
import { checkForUtxos } from "../../utils/checkForUtxos.js";
import { GeneralContext } from "../ContextProviders/GeneralContextProvider.jsx";
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
  CircularProgress,
} from "@mui/material";

const Sat2KasCompleteSwapForm = () => {
  const {
    privateKey,
    setPrivateKey,
    publicKey,
    setPublicKey,
    userAddress,
    makerAddress,
    receivingAmount,
    setReceivingAmount,
    priceForMaker,
    setPriceForMaker,
    derivedP2shAddress,
    setDerivedP2shAddress,
  } = useContext(GeneralContext);
  const [isPolling, setIsPolling] = useState(false);
  const [data, setData] = useState("");
  const [error, setError] = useState(null);
  const [timerId, setTimerId] = useState(null);

  const fetchUtxos = async () => {
    try {
      const response = await checkForUtxos(derivedP2shAddress);
      console.log("response");
      console.log(response);
      if (response != undefined) {
        setData(response.outpoint.transactionId);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    }
    // Schedule next call regardless of success/failure
    const id = setTimeout(fetchUtxos, 10000);
    setTimerId(id);
  };

  const startPolling = () => {
    if (!isPolling) {
      setIsPolling(true);
      fetchUtxos(); // First call happens immediately
    }
  };

  const stopPolling = () => {
    if (isPolling) {
      clearTimeout(timerId);
      setTimerId(null);
      setIsPolling(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  return (
    <>
      {/*
        <Button
                variant="contained"                
                onClick={startPolling}
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
                Start fetching UTXOs
              </Button>
              <TextField
                  fullWidth
                  label="UTXO - Transaction ID"                  
                  value={data}
                  InputProps={{
                    readOnly: true,
                  }}
                />
            <Button
                  variant="contained"                
                  onClick={stopPolling}
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
                  Stop fetching UTXOs
                </Button>
            */}
    </>
  );
};

export default Sat2KasCompleteSwapForm;
