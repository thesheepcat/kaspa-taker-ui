import React, { useState, useEffect, useContext } from "react";
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
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  Keypair,
  PrivateKey,
  PublicKey,
} from "../../kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import {
  SwapType,
  getOfferRequestByPrice,
  getOfferRequestByAmount,
  getDataFromMaker,
} from "../../utils/communication.js";
import { GeneralContext } from "../ContextProviders/GeneralContextProvider.jsx";
import { useNavigate } from "react-router-dom";

const KAS = {
  name: "Kaspa",
  symbol: "KAS",
};

const BTC = {
  name: "Bitcoin",
  symbol: "Satoshi",
};

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
    setSwapType,
  } = useContext(GeneralContext);

  const [amount, setAmount] = useState("");
  const [fromCoin, setFromCoin] = useState(BTC);
  const [toCoin, setToCoin] = useState(KAS);
  const [exchangeRate, setExchangeRate] = useState("");
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);

  const handleAmount = (amount) => {
    setReceivingAmount("");
    setExchangeRate("");
    setAmount(amount);
  };

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
    console.log("swapType");
    console.log(swapType);
  };

  const getOfferFromMaker = async () => {
    console.log(privateKey);
    console.log(publicKey);
    const offerRequest = getOfferRequestByAmount(
      swapType,
      amount,
      privateKey,
      publicKey,
    );
    const response = await getDataFromMaker(offerRequest, makerAddress);
    console.log("response");
    console.log(response);
    const receivingAmount = response["amount"];
    setReceivingAmount(receivingAmount);
    setExchangeRate(receivingAmount / amount);
    const offerValidity = response["valid_until"];
    const priceFromMaker = response["price"];
    setPriceForMaker(priceFromMaker);
  };

  const handleGetOffer = async () => {
    setIsLoadingOffer(true);
    await getOfferFromMaker();
    setIsLoadingOffer(false);
  };

  const handleStartSwap = () => {
    navigate("/swap");
  };

  return (
    <Container sx={{ mt: 5, mb: 5, width: "750px" }}>
      <Box
        elevation={3}
        sx={{
          padding: "30px",
          borderRadius: 2,
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Get offer
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 2, color: "#666" }}
        >
          Insert the amount of BTC (satoshi) you need to exchange to KAS
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            padding: "10px",
            margin: "20px auto",
          }}
        >
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => handleAmount(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {fromCoin.symbol}
                </InputAdornment>
              ),
            }}
          />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <TextField
                fullWidth
                label="From"
                value={fromCoin.name}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid
              item
              xs={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <IconButton
                onClick={handleSwitchCoins}
                aria-label="switch coins"
                disabled
                sx={{
                  bgcolor: "#6fc7b7",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#707579",
                  },
                }}
              >
                <SwapHorizIcon />
              </IconButton>
            </Grid>

            <Grid item xs={5}>
              <TextField
                fullWidth
                label="To"
                value={toCoin.name}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            label="Maker address"
            value={makerAddress}
            InputProps={{
              readOnly: true,
            }}
          />
          {amount !== "" && (
            <Button
              variant="contained"
              onClick={handleGetOffer}
              disabled={isLoadingOffer}
              sx={{
                width: "200px",
                mx: "auto",
                mb: 3,
                py: 1.5,
                bgcolor: "#6fc7b7",
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#6fc7b7",
                },
              }}
            >
              {isLoadingOffer ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Get offer"
              )}
            </Button>
          )}

          {receivingAmount !== "" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "50px",
                }}
              >
                <TextField
                  fullWidth
                  label="Receiving amount"
                  value={receivingAmount}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        {toCoin.symbol}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Exchange rate"
                  value={exchangeRate}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        {toCoin.symbol} / {fromCoin.symbol}
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Button
                variant="contained"
                onClick={handleStartSwap}
                sx={{
                  width: "200px",
                  mx: "auto",
                  mb: 3,
                  py: 1.5,
                  bgcolor: "#6fc7b7",
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "#6fc7b7",
                  },
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
};

export default OfferForm;
