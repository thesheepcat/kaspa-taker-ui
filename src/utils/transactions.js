globalThis.WebSocket = require('websocket').w3cwebsocket;
import { Address, createTransactions, RpcClient, Resolver, PrivateKey, SighashType, createInputSignature } from "../kaspa-wasm32-sdk/web/kaspa/kaspa";
import load from "../kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import { buildRedeemScript } from "./scripting.js";

export const redeemP2shUtxo = async () => {
    const userPrivateKeyString = "ba37b9f18e44439e25754815c9d4a85cbb02402709b5fb3e3eed72f1e86f7e34";
    const userPrivateKey = new PrivateKey(userPrivateKeyString);
    const publicKeyString = "08e56a0089f654d09c7f5b825a5965fb7b9c53251a61c0444549d19091d66627";
    const lnInvoice = "lnbc9440n1pnm3ljspp524mpg70vr36v8j48rqp0q3kweax48kk2jx08ayp2g4tdrkmuaugqdq22dshgjmpwvcqzzsxqzfvsp5k5lqz9k660ql8v3w2clqx4vryum7yt37mmf9n4qesu4ysxtrymfs9qxpqysgqx3q94g28ncl6t2f2vqh9tnv8tuk3hd2u5drkpqge6zgw2sxxczmpgr90vvf76ype4n3yx4t5jdr84ld4aw23t8eemeulplpxw9z4uccqq3ug87";
    const secretHash = "55761479ec1c74c3caa71802f046cecf4d53daca919e7e902a4556d1db7cef10";
    const senderAddress = "kaspa:qz3xpddc75t0kdclc0lfued3yd28ky847natasxrjcplkyvwd3dqwv0eas5cy";
    const timelock = 1740177276000;

    const p2shAddress = "kaspa:pq8l6nau4930nruq22q44xhrzfeh0t59457hcu9dn5kq7nz47ewzgs65wy3wm";
    const p2shAddressObject = new Address(p2shAddress);
    
    const destinationAddress = "kaspa:qqyw26sq38m9f5yu0adcykjevhahh8zny5dxrszyg4yaryy36enzwuyf339gz";
    const destinationAddressObject = new Address(destinationAddress);
    const script = "6382012088a82055761479ec1c74c3caa71802f046cecf4d53daca919e7e902a4556d1db7cef108876aa2047a4ebb0066d23aa644b1accf649b7e9d4819ee04d03f8dd1c1c052e89791250670660fca52a9501b076aa20db23ea0939b0315625b1bd462bccf445321e1aacbe33dd45ade93e3ad567f1ae6888ac";
    const secret = "dee4747142dab5f460c2864f57974ea4ea44e74fb9d743a0da3403f17411c482";
    
    try {
        await load();         
        console.log("Connecting to Kaspad...")
        const rpc = new RpcClient({
            resolver: new Resolver(),
            networkId: "mainnet"
        })
        await rpc.connect();
        let is_connected = await rpc.isConnected;
        console.log("Connected to Kaspad: ", is_connected);
        const { networkId } = await rpc.getServerInfo();

        const { entries: p2shUtxoEntries } = await rpc.getUtxosByAddresses([ p2shAddressObject ])
        if(!p2shUtxoEntries[0]) {
            console.log("No utxo entries found");
            return;
        }
        let p2shSelectedUtxo = p2shUtxoEntries[0];
        console.log("p2shSelectedUtxo")
        console.log(p2shSelectedUtxo)
        
        const transactions = await createTransactions({
            networkId,
            entries: [ p2shSelectedUtxo ],
            outputs: [],
            changeAddress: destinationAddressObject, 
            priorityFee: 0n         
        })        

        let transaction = transactions.transactions[0];
        console.log("Transaction");
        console.log(transaction.toJSON());
        

        const txSignature = transaction.createInputSignature(0, userPrivateKey,SighashType.All);
        console.log("txSignature");
        console.log(txSignature);

        const redeemScript = buildRedeemScript(txSignature, publicKeyString, script, secret);
        //const input0SigScript = payToScriptHashSignatureScript(redeemScript, input0signature);
        console.log("redeemScript");
        console.log(redeemScript);

        transaction.fillInput(0, redeemScript);
        
        console.log("Completely transaction");
        console.log(transaction.toJSON());
        
        await transaction.submit(rpc)
        console.log("Fees:", transaction.feeAmount)
        console.log("Tx mass:", transaction.mass)
        console.log("Transation ID: " + transaction.id)
        rpc.disconnect();
    } catch (error) {
        console.error("Error sending transaction:", error);
    }

}