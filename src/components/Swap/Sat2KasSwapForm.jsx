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
import { Keypair, PrivateKey, PublicKey, Address, addressFromScriptPublicKey, NetworkType, XOnlyPublicKey } from "../../kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import { SwapType, getSat2kasInitSwapRequest, getDataFromMaker } from "../../utils/communication.js";
import { buildSwapContract, getScriptHash, getAddressFromScriptHash } from "../../utils/scripting.js";
import { GeneralContext } from "../ContextProviders/GeneralContextProvider.jsx";
import {decodeInvoice} from "../../utils/lnInvoice.js";

/*
REQUEST
kas_amount: 10
price: 111.69
receiver_address: "kaspa:qzaglyv3qfr2t7jrprfvs432fheqwjz08m7jmn8808ln8czdgqsqw9mn6x5tl"

RESPONSE
ln_invoice: "lnbc11160n1pnmyt5app5puxmhux7rlvdmhrre3r5kp2hxmavsyz5q4ndem0cgg0ywtlj24qsdq22dshgjmpwvcqzzsxqzfvsp52jxvz45204kuh3vunkpcqcx60mcwmslgn2s6ju6napev7l5j53kq9qxpqysgq4gx2jrhvkhcyu9elyf9m540vgqmqred9u8uxq42qnet0cjc0we45j694z5yhkltdvz92ulsrd3casw9x6zkeywel6cxtddesejgsfjcqyqzu4w"
p2sh_address: "kaspa:pqg3m8td89629t87rs2ch7725y8ewc59q3zlf0vs55hemh8k29v9sgu7q86u8"
sender_address: "kaspa:qpw40xultu0a38w0zc9wvenkhlhwmwa33f7lhl74qy75nqmf25eqq7rw04zn6" 
 */

const KAS = {
  name: "Kaspa",
  symbol: "KAS"
}

const BTC = {
  name: "Bitcoin",
  symbol: "Satoshi"
}

const Sat2KasSwapForm = () => {  
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
      setPriceForMaker
    } = useContext(GeneralContext);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState(userAddress.toString());
  const [p2shAddressFromMaker, setP2shAddressFromMaker] = useState("");
  const [lnInvoice, setLnInvoice] = useState("");
  const [timelock, setTimelock] = useState(0);
  const [secretHash, setSecretHash] = useState("");
  const [satAmount, setSatAmount] = useState("");
  const [calculatedP2shAdress, setCalculatedP2shAdress] = useState("");
  const [secret, setSecret] = useState("");
    
  const [amount, setAmount] = useState("");
  const [fromCoin, setFromCoin] = useState(BTC);
  const [toCoin, setToCoin] = useState(KAS);  
  const [exchangeRate, setExchangeRate] = useState(null);  
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);

  const handleDestinationAddress = (value) => {
    setDestinationAddress(value);
  }

  const handleinitizalizeSwapWithMaker = async () => {    
    const initilizeSat2KasSwapRequest = getSat2kasInitSwapRequest(receiverAddress, receivingAmount, priceForMaker, privateKey, publicKey);
    const response = await getDataFromMaker(initilizeSat2KasSwapRequest, makerAddress);
    console.log("response");
    console.log(response);
    setSenderAddress(response["sender_address"]);
    setP2shAddressFromMaker(response["p2sh_address"]);
    setLnInvoice(response["ln_invoice"]);
  }

  const handleDecodeInvoice = () => {
    const {secretHash, satAmount, timelock} = decodeInvoice(lnInvoice);
    setSecretHash(secretHash);
    setSatAmount(satAmount);
    setTimelock(timelock);
  }

  const handleGetOffer = async () => {
    setIsLoadingOffer(true);
    await handleinitizalizeSwapWithMaker();
    setIsLoadingOffer(false);
  };

  const handleCalculateP2shAddress = () => {
    try {
      const publicKeyString = publicKey.toString();
      const senderPublicKey = XOnlyPublicKey.fromAddress(new Address(senderAddress)); 
      const senderPublicKeyString = senderPublicKey.toString();
      const lockingScript = buildSwapContract(secretHash, publicKeyString, timelock, senderPublicKeyString);
      const lockingScriptHash = getScriptHash(lockingScript);
      const p2shAddress = getAddressFromScriptHash(lockingScriptHash);
      setCalculatedP2shAdress(p2shAddress);
    } catch (error) {
      console.log("Calculating P2SH contract generated an error: ", error);
    }
  }

  
return (
    <Container  sx={{ mt: 5, mb: 5, width:"900px" }}>
      <Box elevation={3} sx={{
        padding: "30px",
        borderRadius: 2,
        boxShadow: '0 0 20px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Swap your Bitcoin with Kaspa
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
                label="Destination address"
                value={destinationAddress}
                onChange={(e) => handleDestinationAddress(e.target.value)}
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
                value={priceForMaker}
              />
              </Box>
                <Button
                  variant="contained"                
                  onClick={handleinitizalizeSwapWithMaker}
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
                Calculate P2SH address
              </Button>
              <TextField
                  fullWidth
                  label="Calculated P2SH address"                  
                  value={calculatedP2shAdress.toString()}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  fullWidth
                  label="Secret"                  
                  value={secret}
                  InputProps={{
                    readOnly: true,
                  }}
                />
            </Box>  
        </Box>  
      </Box>
    </Container>
  );
}

export default Sat2KasSwapForm;