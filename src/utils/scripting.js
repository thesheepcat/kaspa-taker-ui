import { Keypair, PrivateKey, PublicKey, ScriptBuilder , Opcodes, payToScriptHashScript,addressFromScriptPublicKey, NetworkType } from "../kaspa-wasm32-sdk/web/kaspa/kaspa.js";
import { blake2b } from 'blakejs';

export const buildSwapContract = (secretHash, publicKeyString, timelock, senderPublicKeyString) => {
    const publicKeyHashString = calculateBlake2b(publicKeyString);
    const senderPublicKeyHashString = calculateBlake2b(senderPublicKeyString);
    const convertedTimelock = BigInt(timelock);   
    
    const atomicSwapScript = new ScriptBuilder;    
    atomicSwapScript
        .addOp(Opcodes.OpIf)
        .addOp(Opcodes.OpSize)
        .addOp(Opcodes.OpData1)
        .addOp(Opcodes.OpData32)
        .addOp(Opcodes.OpEqualVerify)
        .addOp(Opcodes.OpSHA256)
        .addData(secretHash)
        .addOp(Opcodes.OpEqualVerify)
        .addOp(Opcodes.OpDup)
        .addOp(Opcodes.OpBlake2b)
        .addData(publicKeyHashString)
        .addOp(Opcodes.OpElse)
        .addLockTime(convertedTimelock)
        .addOp(Opcodes.OpCheckLockTimeVerify)
        .addOp(Opcodes.OpDup)
        .addOp(Opcodes.OpBlake2b)
        .addData(senderPublicKeyHashString)
        .addOp(Opcodes.OpEndIf)
        .addOp(Opcodes.OpEqualVerify)
        .addOp(Opcodes.OpCheckSig)        
    return atomicSwapScript.drain()
};

const calculateBlake2b = (hexString) => {
    const bytes = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const hash = blake2b(bytes, null, 32);
    return Array.from(hash)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

export const getScriptHash = (script) => {
    return payToScriptHashScript(script);
}

export const getAddressFromScriptHash = (scriptHash) => {
    return addressFromScriptPublicKey(scriptHash, NetworkType.Mainnet)
}

export const buildSpendScript = (signature, publicKeyString, contract, refund=False, secret=None) => {
    const spendingAtomicSwapScript = new ScriptBuilder;    
    spendingAtomicSwapScript
        .addData(signature)
        .addData(publicKeyString)
    if (refund) {
        spendingAtomicSwapScript.addOp(Opcodes.OpFalse)
    } else {
        spendingAtomicSwapScript
            .addData(secret)
            .addOp(Opcodes.OpTrue)
    }
    spendingAtomicSwapScript.addData(contract)
    return spendingAtomicSwapScript.drain()
}

export const buildRedeemScript = (signature, publicKey, contract, secret) => {
    const publicKeyString = publicKey.toString();
    const spendingAtomicSwapScript = new ScriptBuilder;    
    spendingAtomicSwapScript
        .addData(signature)    
        .addData(publicKeyString)
        .addData(secret)
        .addOp(Opcodes.OpTrue)
        .addData(contract)    
    return spendingAtomicSwapScript.drain()
}

