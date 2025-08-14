import React, { useState, useContext } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import {
  Keypair,
  PrivateKey,
  NetworkType,
} from "../../kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import { GeneralContext } from "../ContextProviders/GeneralContextProvider.jsx";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    privateKey,
    setPrivateKey,
    publicKey,
    setPublicKey,
    makerAddress,
    setUserAddress,
  } = useContext(GeneralContext);
  const [privateKeyString, setPrivateKeyString] = useState("");
  const [publicKeyString, setPublicKeyString] = useState("");
  const [userAddressString, setUserAddressString] = useState("");

  const handleGenerateNewKeys = () => {
    const userKeyPair = Keypair.random();
    console.log(userKeyPair);
    const privateKey = new PrivateKey(userKeyPair.privateKey);
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
  };

  const handleMoveToOfferView = () => {
    navigate("/offer");
  };
  return (
    <Container sx={{ mt: 5, mb: 5, width: "800px" }}>
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
          Login to KaspaSwap
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 2, color: "#666", fontStyle: "bold" }}
        >
          The private key generated below is temporary and only used for this
          swap session.
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ mb: 3, color: "#888" }}
        >
          Your funds remain secure in your original wallet. This key is
          discarded after the swap is complete.
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
          <Button
            variant="contained"
            onClick={handleGenerateNewKeys}
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
            Generate new keys
          </Button>
          <TextField
            fullWidth
            label="Private key"
            value={privateKeyString}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            label="Public key"
            value={publicKeyString}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            label="User address"
            value={userAddressString}
            InputProps={{
              readOnly: true,
            }}
          />
          <Button
            variant="contained"
            onClick={handleMoveToOfferView}
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
            Start swapping!
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
