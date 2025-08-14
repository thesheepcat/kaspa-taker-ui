import React, { useState, useEffect, useContext } from "react";
import QRCode from "react-qr-code";
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
  Alert,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Address,
  XOnlyPublicKey,
} from "../../kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import {
  getSat2kasInitSwapRequest,
  getDataFromMaker,
} from "../../utils/communication.js";
import {
  buildSwapContract,
  getScriptHash,
  getAddressFromScriptHash,
} from "../../utils/scripting.js";
import { GeneralContext } from "../ContextProviders/GeneralContextProvider.jsx";
import { decodeInvoice } from "../../utils/lnInvoice.js";
import Sat2KasCompleteSwapForm from "./Sat2KasCompleteSwapForm.jsx";
import { redeemP2shUtxo } from "../../utils/transactions.js";

const KAS = {
  name: "Kaspa",
  symbol: "KAS",
};

const BTC = {
  name: "Bitcoin",
  symbol: "Satoshi",
};

const Sat2KasSwapForm = () => {
  const {
    privateKey,
    publicKey,
    userAddress,
    makerAddress,
    receivingAmount,
    priceForMaker,
    derivedP2shAddress,
    setDerivedP2shAddress,
  } = useContext(GeneralContext);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [derivedP2shAddressString, setDerivedP2shAddressString] = useState("");
  const [isContractVerified, setIsContractVerified] = useState(false);

  const [senderAddress, setSenderAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState(
    userAddress.toString(),
  );
  const [p2shAddressFromMaker, setP2shAddressFromMaker] = useState("");
  const [lnInvoice, setLnInvoice] = useState("");
  const [timelock, setTimelock] = useState(0);
  const [secretHash, setSecretHash] = useState("");
  const [satAmount, setSatAmount] = useState("");
  const [lockingScript, setLockingScript] = useState("");
  const [secret, setSecret] = useState("");

  const [amount, setAmount] = useState("");
  const [fromCoin, setFromCoin] = useState(BTC);
  const [toCoin, setToCoin] = useState(KAS);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);

  const handleDestinationAddress = (addressString) => {
    try {
      const destinationAddress = new Address(addressString);
      setDestinationAddress(destinationAddress);
    } catch {}
  };

  const handleinitizalizeSwapWithMaker = async () => {
    const initilizeSat2KasSwapRequest = getSat2kasInitSwapRequest(
      receiverAddress,
      receivingAmount,
      priceForMaker,
      privateKey,
      publicKey,
    );
    const response = await getDataFromMaker(
      initilizeSat2KasSwapRequest,
      makerAddress,
    );
    console.log("response");
    console.log(response);
    setSenderAddress(response["sender_address"]);
    setP2shAddressFromMaker(response["p2sh_address"]);
    setLnInvoice(response["ln_invoice"]);
  };

  const handleDecodeInvoice = () => {
    const { secretHash, satAmount, timelock } = decodeInvoice(lnInvoice);
    setSecretHash(secretHash);
    setSatAmount(satAmount);
    setTimelock(timelock);
  };

  const handleCalculateP2shAddress = () => {
    try {
      const publicKeyString = publicKey.toString();
      const senderPublicKey = XOnlyPublicKey.fromAddress(
        new Address(senderAddress),
      );
      const senderPublicKeyString = senderPublicKey.toString();
      const lockingScript = buildSwapContract(
        secretHash,
        publicKeyString,
        timelock,
        senderPublicKeyString,
      );
      setLockingScript(lockingScript);
      const lockingScriptHash = getScriptHash(lockingScript);
      const p2shAddress = getAddressFromScriptHash(lockingScriptHash);
      setDerivedP2shAddress(p2shAddress);
      setDerivedP2shAddressString(p2shAddress.toString());
    } catch (error) {
      console.log("Calculating P2SH contract generated an error: ", error);
    }
  };

  const handleRedeemUtxoFromP2sh = async () => {
    try {
      await redeemP2shUtxo(
        privateKey,
        publicKey,
        derivedP2shAddress,
        destinationAddress,
        lockingScript,
        secret,
      );
    } catch (error) {
      console.error("Error on redeem from P2SH: ", error);
    }
  };

  const handleSecret = (secret) => {
    setSecret(secret);
  };

  return (
    <Container sx={{ mt: 5, mb: 5, width: "950px" }}>
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
          Swap your Bitcoin with Kaspa
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            padding: "30px",
            margin: "20px auto",
          }}
        >
          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 2, color: "#666" }}
          >
            Insert the Kaspa address where you need to receive the exchanged
            coins
          </Typography>
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
                gap: "15px",
              }}
            >
              <TextField
                label="Destination address"
                value={destinationAddress}
                sx={{ width: "80%" }}
                onChange={(e) => handleDestinationAddress(e.target.value)}
              />
              <TextField
                label="Receiving amount"
                value={receivingAmount}
                sx={{ width: "20%" }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      {toCoin.symbol}
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={handleinitizalizeSwapWithMaker}
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
                "Initialize swap"
              )}
            </Button>
            <TextField
              fullWidth
              label="Sender address"
              value={senderAddress}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              fullWidth
              label="Contract address (from maker)"
              value={p2shAddressFromMaker}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              fullWidth
              label="LN invoice"
              value={lnInvoice}
              InputProps={{
                readOnly: true,
              }}
            />
            <Button
              variant="contained"
              onClick={handleDecodeInvoice}
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
              Decode invoice
            </Button>
            <TextField
              fullWidth
              label="Secret hash"
              value={secretHash}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              fullWidth
              label="Sat amount"
              value={satAmount}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              fullWidth
              label="Timelock"
              value={timelock}
              InputProps={{
                readOnly: true,
              }}
            />
            <Button
              variant="contained"
              onClick={handleCalculateP2shAddress}
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
              Verify contract address
            </Button>
            <TextField
              fullWidth
              label="Calculated P2SH address"
              value={derivedP2shAddressString}
              InputProps={{
                readOnly: true,
              }}
            />
            {derivedP2shAddressString == p2shAddressFromMaker && (
              <Alert
                severity="success"
                icon={<CheckCircleIcon />}
                sx={{
                  mt: 2,
                  "& .MuiAlert-icon": {
                    color: "#4caf50",
                  },
                }}
              >
                The contract address sent by market maker has been verified
              </Alert>
            )}
            <Typography
              variant="h6"
              component="h6"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              Now you can pay the LN invoice
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ mb: 2, color: "#666" }}
            >
              Be sure to copy the invoice pre-image, once the payment has been
              completed on Lightning network.
            </Typography>
            <TextField
              fullWidth
              label="LN invoice"
              value={lnInvoice}
              InputProps={{
                readOnly: true,
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                my: 2,
              }}
            >
              <QRCode
                size={256}
                style={{ height: "20%", width: "20%" }}
                value={lnInvoice}
                viewBox="0 0 256 256"
              />
            </Box>
            <Typography
              variant="h6"
              component="h6"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              Insert LN invoice pre-image
            </Typography>
            <TextField
              fullWidth
              label="Secret"
              value={secret}
              onChange={(e) => handleSecret(e.target.value)}
            />
            {/*
              {secret &&
              <Sat2KasCompleteSwapForm/>
              }
              */}
            {secret && (
              <Button
                variant="contained"
                onClick={handleRedeemUtxoFromP2sh}
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
                Redeem funds from P2SH
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Sat2KasSwapForm;
