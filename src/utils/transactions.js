globalThis.WebSocket = require('websocket').w3cwebsocket;
import { Address, createTransactions, RpcClient, Resolver, PrivateKey, SighashType } from "../kaspa-wasm32-sdk/web/kaspa/kaspa";
import load from "../kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import { buildRedeemScript } from "./scripting.js";

export const redeemP2shUtxo = async (userPrivateKey, userPublicKey, p2shAddress, destinationAddress, script, secret) => {
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

        const { entries: p2shUtxoEntries } = await rpc.getUtxosByAddresses([ p2shAddress ])
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
            changeAddress: destinationAddress, 
            priorityFee: 200n         
        })        

        let transaction = transactions.transactions[0];
        console.log("Transaction");
        console.log(transaction.toJSON());
        

        const txSignature = transaction.createInputSignature(0, userPrivateKey,SighashType.All).substring(2);
        console.log("txSignature");
        console.log(txSignature);

        const redeemScript = buildRedeemScript(txSignature, userPublicKey, script, secret);
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