import { RpcClient, Address, Resolver, ConnectStrategy } from "../kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import load from "../kaspa-wasm32-sdk/web/kaspa/kaspa.js";

export const checkKaspaNodeConnection = async () => {    
    try {
        await load(); 
        
        const rpc = new RpcClient({
            resolver: new Resolver(),
            networkId: "mainnet"
        })
        await rpc.connect({
                    /**
                     * Indicates if the `async fn connect()` method should return immediately
                     * or wait for connection to occur or fail before returning.
                     * (default is `true`)
                     */
                    blockAsyncConnect: true,
                    /**
                     * ConnectStrategy used to configure the retry or fallback behavior.
                     * In retry mode, the WebSocket will continuously attempt to connect to the server.
                     * (default is {link ConnectStrategy.Retry}).
                     */
                    strategy: ConnectStrategy.Retry,
                    /**
                     * A custom connection timeout in milliseconds.
                     */
                    timeoutDuration: 20000,
                    /** 
                     * A custom retry interval in milliseconds.
                     */
                    retryInterval: 10000,
                })
        let is_connected = await rpc.isConnected;        
        console.log("Connected to Kaspad: ", is_connected);
        //const { networkId } = await rpc.getServerInfo();
        const blockDagInfo = await rpc.getBlockDagInfo();
        console.log("blockDagInfo");
        console.log(blockDagInfo);
        
        const peerAddressObject = new Address("kaspa:qzaglyv3qfr2t7jrprfvs432fheqwjz08m7jmn8808ln8czdgqsqw9mn6x5tl");
        const { entries } = await rpc.getUtxosByAddresses([ peerAddressObject ])
        if(!entries[0]) {
            alert("No utxo entries found");
            return;
        }
        console.log(entries[0]);
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}
