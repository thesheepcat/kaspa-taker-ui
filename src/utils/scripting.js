import { Keypair, PrivateKey, PublicKey, ScriptBuilder , Opcodes } from "../kaspa-wasm32-sdk/web/kaspa/kaspa.js";

export const buildSwapContract = (secretHash, pkhReceiver, timelock, pkhSender) => {
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
        .addData(pkhReceiver)
        .addOp(Opcodes.OpElse)
        .addLockTime(timelock)
        .addOp(Opcodes.OpCheckLockTimeVerify)
        .addOp(Opcodes.OpDup)
        .addOp(Opcodes.OpBlake2b)
        .addData(pkhSender)
        .addOp(Opcodes.OpEndIf)
        .addOp(Opcodes.OpEqualVerify)
        .addOp(Opcodes.OpCheckSig)        
    return atomicSwapScript.drain()
};

export const buildSpendScript = (signature, pubkey, contract, refund=False, secret=None) => {
    const spendingAtomicSwapScript = new ScriptBuilder;    
    spendingAtomicSwapScript
        .addData(signature)
        .addData(pubkey)
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