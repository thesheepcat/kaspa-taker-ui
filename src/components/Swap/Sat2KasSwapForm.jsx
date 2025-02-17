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
import { Keypair, PrivateKey, PublicKey, Address, addressFromScriptPublicKey, NetworkType } from "../../kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import { SwapType, getSat2kasInitSwapRequest, getDataFromMaker } from "../../utils/communication.js";
import { GeneralContext } from "../ContextProviders/GeneralContextProvider.jsx";


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
  const { privateKey, setPrivateKey, publicKey, setPublicKey, makerAddress, receivingAmount, setReceivingAmount, priceForMaker } = useContext(GeneralContext);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [p2shAddressFromMaker, setP2shAddressFromMaker] = useState("");
  const [lnInvoice, setLnInvoice] = useState("");
  
  const [amount, setAmount] = useState("");
  const [fromCoin, setFromCoin] = useState(BTC);
  const [toCoin, setToCoin] = useState(KAS);
  const [swapType, setSwapType] = useState(SwapType.SAT2KAS);
  const [exchangeRate, setExchangeRate] = useState(null);  
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);


  const handleReceivingAddress = (value) => {
    setDestinationAddress(value);
  }


  const initizalizeSwapWithMaker = async () => {    
    const privkey = 'b7e151628aed2a6abf7158809cf4f3c762e7160f38b4da56a784d9045190cfef';
    const pubkey = 'dff1d77f2a671c5f36183726db2341be58feae1da2deced843240f7b502ba659';
    const privateKey = new PrivateKey(privkey);
    const publicKey = new PublicKey(pubkey);
    const receiverAddress = privateKey.toAddress(NetworkType.Mainnet).toString();
    
    const initilizeSat2KasSwapRequest = getSat2kasInitSwapRequest(receiverAddress, receivingAmount, priceForMaker, privateKey, publicKey);
    const response = await getDataFromMaker(initilizeSat2KasSwapRequest, makerAddress);
    console.log("response");
    console.log(response);
    setSenderAddress(response["sender_address"]);
    setP2shAddressFromMaker(response["p2sh_address"]);
    setLnInvoice(response["ln_invoice"]);
  }

  const handleGetOffer = async () => {
    setIsLoadingOffer(true);
    await initizalizeSwapWithMaker();
    setIsLoadingOffer(false);
  };

  
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
                label="Receiving address"
                name="receivingAddress"
                value={destinationAddress}
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
              <TextField
                fullWidth
                label="Sender address"
                name="senderAddress"
                value={senderAddress}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                label="Contract address (from maker)"
                name="contractAddress"
                value={p2shAddressFromMaker}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                label="LN invoice"
                name="lnInvoice"
                value={lnInvoice}
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