globalThis.WebSocket = require('websocket').w3cwebsocket;
import { RpcClient, Resolver, Address } from "../kaspa-wasm32-sdk/web/kaspa/kaspa";
import load from "../kaspa-wasm32-sdk/web/kaspa/kaspa.js";

export const checkForUtxos = async (address) => {
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
    
        const { entries: p2shUtxoEntries } = await rpc.getUtxosByAddresses([ address ]);
        let p2shSelectedUtxo = p2shUtxoEntries[0];
        console.log("p2shSelectedUtxo");
        console.log(p2shSelectedUtxo);
        rpc.disconnect();
        return p2shSelectedUtxo
    } catch (error) {
        console.error("Error on checking UTXOs on P2SH address: ", error);
    }
}