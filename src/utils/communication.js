import { Keypair, PrivateKey, PublicKey, signMessage, verifyMessage } from "../kaspa-wasm32-sdk/web/kaspa/kaspa";

const MessageType = {
    INIT_SWAP: "init_swap",
    PRICE: "price"
}

export const SwapType = {
    SAT2KAS: "sat2kas",
    KAS2SAT: "kas2sat"
}

const getPricePayload = (swapType, price = null, amount = null) => {
    const payload = {
        'swap_type': swapType, 
        'p2p_price': price,
        'amount': amount
    }
    return payload
} 

const getSat2KasSwapPayload = (receiverAddress, amount, price ) => {
    const payload = {
        'receiver_address': receiverAddress, 
        'kas_amount': amount,
        'price': price
    }
    return payload
}

const getGeneralRequest = (messageType, payload, privKey, pubkey) => {
    const messageToSign = messageType + ":" + JSON.stringify(payload);
    const signature = signMessage({message: messageToSign, privateKey: privKey, noAuxRand: false});
    const requestBody = { 
        'type': messageType,
        'payload': payload,
        'pubkey': pubkey.toString(),
        'signature': signature
    }
    return requestBody
}

export const getPricesRequest = (swapType, privKey, pubkey) => {
    const payload = getPricePayload(swapType);
    const requestBody = getGeneralRequest(MessageType.PRICE, payload, privKey, pubkey);
    return requestBody
}

export const getOfferRequestByPrice = (swapType, price, privKey, pubkey) => {
    const payload = getPricePayload(swapType, price=price);
    const requestBody = getGeneralRequest(MessageType.PRICE, payload, privKey, pubkey);
    return requestBody
}

export const getOfferRequestByAmount = (swapType, amount, privKey, pubkey) => {
    const payload = getPricePayload(swapType, null, amount);
    const requestBody = getGeneralRequest(MessageType.PRICE, payload, privKey, pubkey);
    return requestBody
}

export const getSat2kasInitSwapRequest = (receiverAddress, amount, price, privKey, pubkey) => {
    const payload = getSat2KasSwapPayload(receiverAddress, amount, price);
    console.log(payload);
    const requestBody = getGeneralRequest(MessageType.INIT_SWAP, payload, privKey, pubkey);
    return requestBody
}

export const getDataFromMaker = async (requestBody, makerAddress) => {
    console.log("requestBody");
    console.log(requestBody);
    try {
        const requestBodyString = JSON.stringify(requestBody);
        const rawResponse = await fetch(makerAddress, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: requestBodyString
        });
        if (!rawResponse.ok) {
            throw new Error('Error on POST request');            
        } 
        const content = await rawResponse.json();
        console.log("content");
        console.log(content);
        const message = content["type"] + ":" + JSON.stringify(content["payload"]);
        const signature = content["signature"];
        const publicKey = content["pubkey"];
        const isMakerSignatureValid = verifyMessage({message: message, signature : signature, publicKey: publicKey})
        console.log("Valid signature on maker's message: " + isMakerSignatureValid);
        const payload = content["payload"];
        return payload
    } catch (responseError) {
        console.log(responseError)
    }
}

        
    
        