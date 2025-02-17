/* tslint:disable */
/* eslint-disable */
/**
* Returns the version of the Rusty Kaspa framework.
* @category General
* @returns {string}
*/
export function version(): string;
/**
* Configuration for the WASM32 bindings runtime interface.
* @see {@link IWASM32BindingsConfig}
* @category General
* @param {IWASM32BindingsConfig} config
*/
export function initWASM32Bindings(config: IWASM32BindingsConfig): void;
/**
* Initialize Rust panic handler in console mode.
*
* This will output additional debug information during a panic to the console.
* This function should be called right after loading WASM libraries.
* @category General
*/
export function initConsolePanicHook(): void;
/**
* Initialize Rust panic handler in browser mode.
*
* This will output additional debug information during a panic in the browser
* by creating a full-screen `DIV`. This is useful on mobile devices or where
* the user otherwise has no access to console/developer tools. Use
* {@link presentPanicHookLogs} to activate the panic logs in the
* browser environment.
* @see {@link presentPanicHookLogs}
* @category General
*/
export function initBrowserPanicHook(): void;
/**
* Present panic logs to the user in the browser.
*
* This function should be called after a panic has occurred and the
* browser-based panic hook has been activated. It will present the
* collected panic logs in a full-screen `DIV` in the browser.
* @see {@link initBrowserPanicHook}
* @category General
*/
export function presentPanicHookLogs(): void;
/**
*r" Deferred promise - an object that has `resolve()` and `reject()`
*r" functions that can be called outside of the promise body.
*r" WARNING: This function uses `eval` and can not be used in environments
*r" where dynamically-created code can not be executed such as web browser
*r" extensions.
*r" @category General
* @returns {Promise<any>}
*/
export function defer(): Promise<any>;
/**
*Set the logger log level using a string representation.
*Available variants are: 'off', 'error', 'warn', 'info', 'debug', 'trace'
*@category General
* @param {"off" | "error" | "warn" | "info" | "debug" | "trace"} level
*/
export function setLogLevel(level: "off" | "error" | "warn" | "info" | "debug" | "trace"): void;
/**
*
* Languages supported by BIP39.
*
* Presently only English is specified by the BIP39 standard.
*
* @see {@link Mnemonic}
*
* @category Wallet SDK
*/
export enum Language {
/**
* English is presently the only supported language
*/
  English = 0,
}
/**
*
*  Kaspa `Address` version (`PubKey`, `PubKey ECDSA`, `ScriptHash`)
*
* @category Address
*/
export enum AddressVersion {
/**
* PubKey addresses always have the version byte set to 0
*/
  PubKey = 0,
/**
* PubKey ECDSA addresses always have the version byte set to 1
*/
  PubKeyECDSA = 1,
/**
* ScriptHash addresses always have the version byte set to 8
*/
  ScriptHash = 8,
}
/**
* Kaspa Sighash types allowed by consensus
* @category Consensus
*/
export enum SighashType {
  All = 0,
  None = 1,
  Single = 2,
  AllAnyOneCanPay = 3,
  NoneAnyOneCanPay = 4,
  SingleAnyOneCanPay = 5,
}
/**
* @category Consensus
*/
export enum NetworkType {
  Mainnet = 0,
  Testnet = 1,
  Devnet = 2,
  Simnet = 3,
}

/**
 * Interface for configuring workflow-rs WASM32 bindings.
 * 
 * @category General
 */
export interface IWASM32BindingsConfig {
    /**
     * This option can be used to disable the validation of class names
     * for instances of classes exported by Rust WASM32 when passing
     * these classes to WASM32 functions.
     * 
     * This can be useful to programmatically disable checks when using
     * a bundler that mangles class symbol names.
     */
    validateClassNames : boolean;
}



    /**
     * Generic network address representation.
     * 
     * @category General
     */
    export interface INetworkAddress {
        /**
         * IPv4 or IPv6 address.
         */
        ip: string;
        /**
         * Optional port number.
         */
        port?: number;
    }



/**
 * Interface defines the structure of a Script Public Key.
 * 
 * @category Consensus
 */
export interface IScriptPublicKey {
    version : number;
    script: HexString;
}



/**
 * Color range configuration for Hex View.
 * 
 * @category General
 */ 
export interface IHexViewColor {
    start: number;
    end: number;
    color?: string;
    background?: string;
}

/**
 * Configuration interface for Hex View.
 * 
 * @category General
 */ 
export interface IHexViewConfig {
    offset? : number;
    replacementCharacter? : string;
    width? : number;
    colors? : IHexViewColor[];
}



/**
 * A string containing a hexadecimal representation of the data (typically representing for IDs or Hashes).
 * 
 * @category General
 */ 
export type HexString = string;


/**
*
* Abortable trigger wraps an `Arc<AtomicBool>`, which can be cloned
* to signal task terminating using an atomic bool.
*
* ```text
* let abortable = Abortable::default();
* let result = my_task(abortable).await?;
* // ... elsewhere
* abortable.abort();
* ```
*
* @category General
*/
export class Abortable {
  free(): void;
/**
*/
  constructor();
/**
* @returns {boolean}
*/
  isAborted(): boolean;
/**
*/
  abort(): void;
/**
*/
  check(): void;
/**
*/
  reset(): void;
}
/**
* Error emitted by [`Abortable`].
* @category General
*/
export class Aborted {
  free(): void;
}
/**
* Kaspa [`Address`] struct that serializes to and from an address format string: `kaspa:qz0s...t8cv`.
*
* @category Address
*/
export class Address {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
/**
* @param {string} address
*/
  constructor(address: string);
/**
* @param {string} address
* @returns {boolean}
*/
  static validate(address: string): boolean;
/**
* Convert an address to a string.
* @returns {string}
*/
  toString(): string;
/**
* @param {number} n
* @returns {string}
*/
  short(n: number): string;
/**
*/
  readonly payload: string;
/**
*/
  readonly prefix: string;
/**
*/
  setPrefix: string;
/**
*/
  readonly version: string;
}
/**
*
* Key derivation path
*
* @category Wallet SDK
*/
export class DerivationPath {
  free(): void;
/**
* @param {string} path
*/
  constructor(path: string);
/**
* Is this derivation path empty? (i.e. the root)
* @returns {boolean}
*/
  isEmpty(): boolean;
/**
* Get the count of [`ChildNumber`] values in this derivation path.
* @returns {number}
*/
  length(): number;
/**
* Get the parent [`DerivationPath`] for the current one.
*
* Returns `Undefined` if this is already the root path.
* @returns {DerivationPath | undefined}
*/
  parent(): DerivationPath | undefined;
/**
* Push a [`ChildNumber`] onto an existing derivation path.
* @param {number} child_number
* @param {boolean | undefined} [hardened]
*/
  push(child_number: number, hardened?: boolean): void;
/**
* @returns {string}
*/
  toString(): string;
}
/**
* @category General
*/
export class Hash {
  free(): void;
/**
* @param {string} hex_str
*/
  constructor(hex_str: string);
/**
* @returns {string}
*/
  toString(): string;
}
/**
* Data structure that contains a secret and public keys.
* @category Wallet SDK
*/
export class Keypair {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
/**
* Get the [`Address`] of this Keypair's [`PublicKey`].
* Receives a [`NetworkType`](kaspa_consensus_core::network::NetworkType)
* to determine the prefix of the address.
* JavaScript: `let address = keypair.toAddress(NetworkType.MAINNET);`.
* @param {NetworkType | NetworkId | string} network
* @returns {Address}
*/
  toAddress(network: NetworkType | NetworkId | string): Address;
/**
* Get `ECDSA` [`Address`] of this Keypair's [`PublicKey`].
* Receives a [`NetworkType`](kaspa_consensus_core::network::NetworkType)
* to determine the prefix of the address.
* JavaScript: `let address = keypair.toAddress(NetworkType.MAINNET);`.
* @param {NetworkType | NetworkId | string} network
* @returns {Address}
*/
  toAddressECDSA(network: NetworkType | NetworkId | string): Address;
/**
* Create a new random [`Keypair`].
* JavaScript: `let keypair = Keypair::random();`.
* @returns {Keypair}
*/
  static random(): Keypair;
/**
* Create a new [`Keypair`] from a [`PrivateKey`].
* JavaScript: `let privkey = new PrivateKey(hexString); let keypair = privkey.toKeypair();`.
* @param {PrivateKey} secret_key
* @returns {Keypair}
*/
  static fromPrivateKey(secret_key: PrivateKey): Keypair;
/**
* Get the [`PrivateKey`] of this [`Keypair`].
*/
  readonly privateKey: string;
/**
* Get the [`PublicKey`] of this [`Keypair`].
*/
  readonly publicKey: string;
/**
* Get the `XOnlyPublicKey` of this [`Keypair`].
*/
  readonly xOnlyPublicKey: any;
}
/**
* BIP39 mnemonic phrases: sequences of words representing cryptographic keys.
* @category Wallet SDK
*/
export class Mnemonic {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
/**
* @param {string} phrase
* @param {Language | undefined} [language]
*/
  constructor(phrase: string, language?: Language);
/**
* Validate mnemonic phrase. Returns `true` if the phrase is valid, `false` otherwise.
* @param {string} phrase
* @param {Language | undefined} [language]
* @returns {boolean}
*/
  static validate(phrase: string, language?: Language): boolean;
/**
* @param {number | undefined} [word_count]
* @returns {Mnemonic}
*/
  static random(word_count?: number): Mnemonic;
/**
* @param {string | undefined} [password]
* @returns {string}
*/
  toSeed(password?: string): string;
/**
*/
  entropy: string;
/**
*/
  phrase: string;
}
/**
*
* NetworkId is a unique identifier for a kaspa network instance.
* It is composed of a network type and an optional suffix.
*
* @category Consensus
*/
export class NetworkId {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
/**
* @param {any} value
*/
  constructor(value: any);
/**
* @returns {string}
*/
  toString(): string;
/**
* @returns {string}
*/
  addressPrefix(): string;
/**
*/
  readonly id: string;
/**
*/
  suffix?: number;
/**
*/
  type: NetworkType;
}
/**
* Data structure that envelops a Private Key.
* @category Wallet SDK
*/
export class PrivateKey {
  free(): void;
/**
* Create a new [`PrivateKey`] from a hex-encoded string.
* @param {string} key
*/
  constructor(key: string);
/**
* Returns the [`PrivateKey`] key encoded as a hex string.
* @returns {string}
*/
  toString(): string;
/**
* Generate a [`Keypair`] from this [`PrivateKey`].
* @returns {Keypair}
*/
  toKeypair(): Keypair;
/**
* @returns {PublicKey}
*/
  toPublicKey(): PublicKey;
/**
* Get the [`Address`] of the PublicKey generated from this PrivateKey.
* Receives a [`NetworkType`](kaspa_consensus_core::network::NetworkType)
* to determine the prefix of the address.
* JavaScript: `let address = privateKey.toAddress(NetworkType.MAINNET);`.
* @param {NetworkType | NetworkId | string} network
* @returns {Address}
*/
  toAddress(network: NetworkType | NetworkId | string): Address;
/**
* Get `ECDSA` [`Address`] of the PublicKey generated from this PrivateKey.
* Receives a [`NetworkType`](kaspa_consensus_core::network::NetworkType)
* to determine the prefix of the address.
* JavaScript: `let address = privateKey.toAddress(NetworkType.MAINNET);`.
* @param {NetworkType | NetworkId | string} network
* @returns {Address}
*/
  toAddressECDSA(network: NetworkType | NetworkId | string): Address;
}
/**
*
* Helper class to generate private keys from an extended private key (XPrv).
* This class accepts the master Kaspa XPrv string (e.g. `xprv1...`) and generates
* private keys for the receive and change paths given the pre-set parameters
* such as account index, multisig purpose and cosigner index.
*
* Please note that in Kaspa master private keys use `kprv` prefix.
*
* @see {@link PublicKeyGenerator}, {@link XPub}, {@link XPrv}, {@link Mnemonic}
* @category Wallet SDK
*/
export class PrivateKeyGenerator {
  free(): void;
/**
* @param {XPrv | string} xprv
* @param {boolean} is_multisig
* @param {bigint} account_index
* @param {number | undefined} [cosigner_index]
*/
  constructor(xprv: XPrv | string, is_multisig: boolean, account_index: bigint, cosigner_index?: number);
/**
* @param {number} index
* @returns {PrivateKey}
*/
  receiveKey(index: number): PrivateKey;
/**
* @param {number} index
* @returns {PrivateKey}
*/
  changeKey(index: number): PrivateKey;
}
/**
* Data structure that envelopes a PublicKey.
* Only supports Schnorr-based addresses.
* @category Wallet SDK
*/
export class PublicKey {
  free(): void;
/**
* Create a new [`PublicKey`] from a hex-encoded string.
* @param {string} key
*/
  constructor(key: string);
/**
* @returns {string}
*/
  toString(): string;
/**
* Get the [`Address`] of this PublicKey.
* Receives a [`NetworkType`] to determine the prefix of the address.
* JavaScript: `let address = publicKey.toAddress(NetworkType.MAINNET);`.
* @param {NetworkType | NetworkId | string} network
* @returns {Address}
*/
  toAddress(network: NetworkType | NetworkId | string): Address;
/**
* Get `ECDSA` [`Address`] of this PublicKey.
* Receives a [`NetworkType`] to determine the prefix of the address.
* JavaScript: `let address = publicKey.toAddress(NetworkType.MAINNET);`.
* @param {NetworkType | NetworkId | string} network
* @returns {Address}
*/
  toAddressECDSA(network: NetworkType | NetworkId | string): Address;
/**
* @returns {XOnlyPublicKey}
*/
  toXOnlyPublicKey(): XOnlyPublicKey;
/**
* Compute a 4-byte key fingerprint for this public key as a hex string.
* Default implementation uses `RIPEMD160(SHA256(public_key))`.
* @returns {HexString | undefined}
*/
  fingerprint(): HexString | undefined;
}
/**
*
* Helper class to generate public keys from an extended public key (XPub)
* that has been derived up to the co-signer index.
*
* Please note that in Kaspa master public keys use `kpub` prefix.
*
* @see {@link PrivateKeyGenerator}, {@link XPub}, {@link XPrv}, {@link Mnemonic}
* @category Wallet SDK
*/
export class PublicKeyGenerator {
  free(): void;
/**
* @param {XPub | string} kpub
* @param {number | undefined} [cosigner_index]
* @returns {PublicKeyGenerator}
*/
  static fromXPub(kpub: XPub | string, cosigner_index?: number): PublicKeyGenerator;
/**
* @param {XPrv | string} xprv
* @param {boolean} is_multisig
* @param {bigint} account_index
* @param {number | undefined} [cosigner_index]
* @returns {PublicKeyGenerator}
*/
  static fromMasterXPrv(xprv: XPrv | string, is_multisig: boolean, account_index: bigint, cosigner_index?: number): PublicKeyGenerator;
/**
* Generate Receive Public Key derivations for a given range.
* @param {number} start
* @param {number} end
* @returns {(PublicKey | string)[]}
*/
  receivePubkeys(start: number, end: number): (PublicKey | string)[];
/**
* Generate a single Receive Public Key derivation at a given index.
* @param {number} index
* @returns {PublicKey}
*/
  receivePubkey(index: number): PublicKey;
/**
* Generate a range of Receive Public Key derivations and return them as strings.
* @param {number} start
* @param {number} end
* @returns {Array<string>}
*/
  receivePubkeysAsStrings(start: number, end: number): Array<string>;
/**
* Generate a single Receive Public Key derivation at a given index and return it as a string.
* @param {number} index
* @returns {string}
*/
  receivePubkeyAsString(index: number): string;
/**
* Generate Receive Address derivations for a given range.
* @param {NetworkType | NetworkId | string} networkType
* @param {number} start
* @param {number} end
* @returns {Address[]}
*/
  receiveAddresses(networkType: NetworkType | NetworkId | string, start: number, end: number): Address[];
/**
* Generate a single Receive Address derivation at a given index.
* @param {NetworkType | NetworkId | string} networkType
* @param {number} index
* @returns {Address}
*/
  receiveAddress(networkType: NetworkType | NetworkId | string, index: number): Address;
/**
* Generate a range of Receive Address derivations and return them as strings.
* @param {NetworkType | NetworkId | string} networkType
* @param {number} start
* @param {number} end
* @returns {Array<string>}
*/
  receiveAddressAsStrings(networkType: NetworkType | NetworkId | string, start: number, end: number): Array<string>;
/**
* Generate a single Receive Address derivation at a given index and return it as a string.
* @param {NetworkType | NetworkId | string} networkType
* @param {number} index
* @returns {string}
*/
  receiveAddressAsString(networkType: NetworkType | NetworkId | string, index: number): string;
/**
* Generate Change Public Key derivations for a given range.
* @param {number} start
* @param {number} end
* @returns {(PublicKey | string)[]}
*/
  changePubkeys(start: number, end: number): (PublicKey | string)[];
/**
* Generate a single Change Public Key derivation at a given index.
* @param {number} index
* @returns {PublicKey}
*/
  changePubkey(index: number): PublicKey;
/**
* Generate a range of Change Public Key derivations and return them as strings.
* @param {number} start
* @param {number} end
* @returns {Array<string>}
*/
  changePubkeysAsStrings(start: number, end: number): Array<string>;
/**
* Generate a single Change Public Key derivation at a given index and return it as a string.
* @param {number} index
* @returns {string}
*/
  changePubkeyAsString(index: number): string;
/**
* Generate Change Address derivations for a given range.
* @param {NetworkType | NetworkId | string} networkType
* @param {number} start
* @param {number} end
* @returns {Address[]}
*/
  changeAddresses(networkType: NetworkType | NetworkId | string, start: number, end: number): Address[];
/**
* Generate a single Change Address derivation at a given index.
* @param {NetworkType | NetworkId | string} networkType
* @param {number} index
* @returns {Address}
*/
  changeAddress(networkType: NetworkType | NetworkId | string, index: number): Address;
/**
* Generate a range of Change Address derivations and return them as strings.
* @param {NetworkType | NetworkId | string} networkType
* @param {number} start
* @param {number} end
* @returns {Array<string>}
*/
  changeAddressAsStrings(networkType: NetworkType | NetworkId | string, start: number, end: number): Array<string>;
/**
* Generate a single Change Address derivation at a given index and return it as a string.
* @param {NetworkType | NetworkId | string} networkType
* @param {number} index
* @returns {string}
*/
  changeAddressAsString(networkType: NetworkType | NetworkId | string, index: number): string;
/**
* @returns {string}
*/
  toString(): string;
}
/**
* Represents a Kaspad ScriptPublicKey
* @category Consensus
*/
export class ScriptPublicKey {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
/**
* @param {number} version
* @param {any} script
*/
  constructor(version: number, script: any);
/**
*/
  readonly script: string;
/**
*/
  version: number;
}
/**
*/
export class SigHashType {
  free(): void;
}
/**
* Holds details about an individual transaction output in a utxo
* set such as whether or not it was contained in a coinbase tx, the daa
* score of the block that accepts the tx, its public key script, and how
* much it pays.
* @category Consensus
*/
export class TransactionUtxoEntry {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
/**
*/
  amount: bigint;
/**
*/
  blockDaaScore: bigint;
/**
*/
  isCoinbase: boolean;
/**
*/
  scriptPublicKey: ScriptPublicKey;
}
/**
*
* Data structure that envelopes a XOnlyPublicKey.
*
* XOnlyPublicKey is used as a payload part of the {@link Address}.
*
* @see {@link PublicKey}
* @category Wallet SDK
*/
export class XOnlyPublicKey {
  free(): void;
/**
* @param {string} key
*/
  constructor(key: string);
/**
* @returns {string}
*/
  toString(): string;
/**
* Get the [`Address`] of this XOnlyPublicKey.
* Receives a [`NetworkType`] to determine the prefix of the address.
* JavaScript: `let address = xOnlyPublicKey.toAddress(NetworkType.MAINNET);`.
* @param {NetworkType | NetworkId | string} network
* @returns {Address}
*/
  toAddress(network: NetworkType | NetworkId | string): Address;
/**
* Get `ECDSA` [`Address`] of this XOnlyPublicKey.
* Receives a [`NetworkType`] to determine the prefix of the address.
* JavaScript: `let address = xOnlyPublicKey.toAddress(NetworkType.MAINNET);`.
* @param {NetworkType | NetworkId | string} network
* @returns {Address}
*/
  toAddressECDSA(network: NetworkType | NetworkId | string): Address;
/**
* @param {Address} address
* @returns {XOnlyPublicKey}
*/
  static fromAddress(address: Address): XOnlyPublicKey;
}
/**
*
* Extended private key (XPrv).
*
* This class allows accepts a master seed and provides
* functions for derivation of dependent child private keys.
*
* Please note that Kaspa extended private keys use `kprv` prefix.
*
* @see {@link PrivateKeyGenerator}, {@link PublicKeyGenerator}, {@link XPub}, {@link Mnemonic}
* @category Wallet SDK
*/
export class XPrv {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
/**
* @param {HexString} seed
*/
  constructor(seed: HexString);
/**
* Create {@link XPrv} from `xprvxxxx..` string
* @param {string} xprv
* @returns {XPrv}
*/
  static fromXPrv(xprv: string): XPrv;
/**
* @param {number} child_number
* @param {boolean | undefined} [hardened]
* @returns {XPrv}
*/
  deriveChild(child_number: number, hardened?: boolean): XPrv;
/**
* @param {any} path
* @returns {XPrv}
*/
  derivePath(path: any): XPrv;
/**
* @param {string} prefix
* @returns {string}
*/
  intoString(prefix: string): string;
/**
* @returns {string}
*/
  toString(): string;
/**
* @returns {XPub}
*/
  toXPub(): XPub;
/**
* @returns {PrivateKey}
*/
  toPrivateKey(): PrivateKey;
/**
*/
  readonly chainCode: string;
/**
*/
  readonly childNumber: number;
/**
*/
  readonly depth: number;
/**
*/
  readonly parentFingerprint: string;
/**
*/
  readonly privateKey: string;
/**
*/
  readonly xprv: string;
}
/**
*
* Extended public key (XPub).
*
* This class allows accepts another XPub and and provides
* functions for derivation of dependent child public keys.
*
* Please note that Kaspa extended public keys use `kpub` prefix.
*
* @see {@link PrivateKeyGenerator}, {@link PublicKeyGenerator}, {@link XPrv}, {@link Mnemonic}
* @category Wallet SDK
*/
export class XPub {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
/**
* @param {string} xpub
*/
  constructor(xpub: string);
/**
* @param {number} child_number
* @param {boolean | undefined} [hardened]
* @returns {XPub}
*/
  deriveChild(child_number: number, hardened?: boolean): XPub;
/**
* @param {any} path
* @returns {XPub}
*/
  derivePath(path: any): XPub;
/**
* @param {string} prefix
* @returns {string}
*/
  intoString(prefix: string): string;
/**
* @returns {PublicKey}
*/
  toPublicKey(): PublicKey;
/**
*/
  readonly chainCode: string;
/**
*/
  readonly childNumber: number;
/**
*/
  readonly depth: number;
/**
*/
  readonly parentFingerprint: string;
/**
*/
  readonly xpub: string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly version: (a: number) => void;
  readonly __wbg_privatekey_free: (a: number, b: number) => void;
  readonly privatekey_try_new: (a: number, b: number, c: number) => void;
  readonly privatekey_toString: (a: number, b: number) => void;
  readonly privatekey_toKeypair: (a: number, b: number) => void;
  readonly privatekey_toPublicKey: (a: number, b: number) => void;
  readonly privatekey_toAddress: (a: number, b: number, c: number) => void;
  readonly privatekey_toAddressECDSA: (a: number, b: number, c: number) => void;
  readonly __wbg_publickey_free: (a: number, b: number) => void;
  readonly publickey_try_new: (a: number, b: number, c: number) => void;
  readonly publickey_toString: (a: number, b: number) => void;
  readonly publickey_toAddress: (a: number, b: number, c: number) => void;
  readonly publickey_toAddressECDSA: (a: number, b: number, c: number) => void;
  readonly publickey_toXOnlyPublicKey: (a: number) => number;
  readonly publickey_fingerprint: (a: number) => number;
  readonly __wbg_xonlypublickey_free: (a: number, b: number) => void;
  readonly xonlypublickey_try_new: (a: number, b: number, c: number) => void;
  readonly xonlypublickey_toString: (a: number, b: number) => void;
  readonly xonlypublickey_toAddress: (a: number, b: number, c: number) => void;
  readonly xonlypublickey_toAddressECDSA: (a: number, b: number, c: number) => void;
  readonly xonlypublickey_fromAddress: (a: number, b: number) => void;
  readonly __wbg_xpub_free: (a: number, b: number) => void;
  readonly xpub_try_new: (a: number, b: number, c: number) => void;
  readonly xpub_deriveChild: (a: number, b: number, c: number, d: number) => void;
  readonly xpub_derivePath: (a: number, b: number, c: number) => void;
  readonly xpub_intoString: (a: number, b: number, c: number, d: number) => void;
  readonly xpub_toPublicKey: (a: number) => number;
  readonly xpub_xpub: (a: number, b: number) => void;
  readonly xpub_depth: (a: number) => number;
  readonly xpub_parentFingerprint: (a: number, b: number) => void;
  readonly xpub_childNumber: (a: number) => number;
  readonly xpub_chainCode: (a: number, b: number) => void;
  readonly __wbg_derivationpath_free: (a: number, b: number) => void;
  readonly derivationpath_new: (a: number, b: number, c: number) => void;
  readonly derivationpath_isEmpty: (a: number) => number;
  readonly derivationpath_length: (a: number) => number;
  readonly derivationpath_parent: (a: number) => number;
  readonly derivationpath_push: (a: number, b: number, c: number, d: number) => void;
  readonly derivationpath_toString: (a: number, b: number) => void;
  readonly __wbg_xprv_free: (a: number, b: number) => void;
  readonly xprv_try_new: (a: number, b: number) => void;
  readonly xprv_fromXPrv: (a: number, b: number, c: number) => void;
  readonly xprv_deriveChild: (a: number, b: number, c: number, d: number) => void;
  readonly xprv_derivePath: (a: number, b: number, c: number) => void;
  readonly xprv_intoString: (a: number, b: number, c: number, d: number) => void;
  readonly xprv_toString: (a: number, b: number) => void;
  readonly xprv_toXPub: (a: number, b: number) => void;
  readonly xprv_toPrivateKey: (a: number, b: number) => void;
  readonly xprv_xprv: (a: number, b: number) => void;
  readonly xprv_privateKey: (a: number, b: number) => void;
  readonly xprv_depth: (a: number) => number;
  readonly xprv_parentFingerprint: (a: number, b: number) => void;
  readonly xprv_childNumber: (a: number) => number;
  readonly xprv_chainCode: (a: number, b: number) => void;
  readonly __wbg_privatekeygenerator_free: (a: number, b: number) => void;
  readonly privatekeygenerator_new: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly privatekeygenerator_receiveKey: (a: number, b: number, c: number) => void;
  readonly privatekeygenerator_changeKey: (a: number, b: number, c: number) => void;
  readonly __wbg_keypair_free: (a: number, b: number) => void;
  readonly keypair_get_public_key: (a: number, b: number) => void;
  readonly keypair_get_private_key: (a: number, b: number) => void;
  readonly keypair_get_xonly_public_key: (a: number) => number;
  readonly keypair_toAddress: (a: number, b: number, c: number) => void;
  readonly keypair_toAddressECDSA: (a: number, b: number, c: number) => void;
  readonly keypair_random: (a: number) => void;
  readonly keypair_fromPrivateKey: (a: number, b: number) => void;
  readonly __wbg_publickeygenerator_free: (a: number, b: number) => void;
  readonly publickeygenerator_fromXPub: (a: number, b: number, c: number, d: number) => void;
  readonly publickeygenerator_fromMasterXPrv: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly publickeygenerator_receivePubkeys: (a: number, b: number, c: number, d: number) => void;
  readonly publickeygenerator_receivePubkey: (a: number, b: number, c: number) => void;
  readonly publickeygenerator_receivePubkeysAsStrings: (a: number, b: number, c: number, d: number) => void;
  readonly publickeygenerator_receivePubkeyAsString: (a: number, b: number, c: number) => void;
  readonly publickeygenerator_receiveAddresses: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly publickeygenerator_receiveAddress: (a: number, b: number, c: number, d: number) => void;
  readonly publickeygenerator_receiveAddressAsStrings: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly publickeygenerator_receiveAddressAsString: (a: number, b: number, c: number, d: number) => void;
  readonly publickeygenerator_changePubkeys: (a: number, b: number, c: number, d: number) => void;
  readonly publickeygenerator_changePubkey: (a: number, b: number, c: number) => void;
  readonly publickeygenerator_changePubkeysAsStrings: (a: number, b: number, c: number, d: number) => void;
  readonly publickeygenerator_changePubkeyAsString: (a: number, b: number, c: number) => void;
  readonly publickeygenerator_changeAddresses: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly publickeygenerator_changeAddress: (a: number, b: number, c: number, d: number) => void;
  readonly publickeygenerator_changeAddressAsStrings: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly publickeygenerator_changeAddressAsString: (a: number, b: number, c: number, d: number) => void;
  readonly publickeygenerator_toString: (a: number, b: number) => void;
  readonly __wbg_mnemonic_free: (a: number, b: number) => void;
  readonly mnemonic_constructor: (a: number, b: number, c: number, d: number) => void;
  readonly mnemonic_validate: (a: number, b: number, c: number) => number;
  readonly mnemonic_entropy: (a: number, b: number) => void;
  readonly mnemonic_set_entropy: (a: number, b: number, c: number) => void;
  readonly mnemonic_random: (a: number, b: number, c: number) => void;
  readonly mnemonic_phrase: (a: number, b: number) => void;
  readonly mnemonic_set_phrase: (a: number, b: number, c: number) => void;
  readonly mnemonic_toSeed: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_sighashtype_free: (a: number, b: number) => void;
  readonly __wbg_networkid_free: (a: number, b: number) => void;
  readonly __wbg_get_networkid_type: (a: number) => number;
  readonly __wbg_set_networkid_type: (a: number, b: number) => void;
  readonly __wbg_get_networkid_suffix: (a: number, b: number) => void;
  readonly __wbg_set_networkid_suffix: (a: number, b: number, c: number) => void;
  readonly networkid_ctor: (a: number, b: number) => void;
  readonly networkid_id: (a: number, b: number) => void;
  readonly networkid_toString: (a: number, b: number) => void;
  readonly networkid_addressPrefix: (a: number, b: number) => void;
  readonly __wbg_transactionutxoentry_free: (a: number, b: number) => void;
  readonly __wbg_get_transactionutxoentry_amount: (a: number) => number;
  readonly __wbg_set_transactionutxoentry_amount: (a: number, b: number) => void;
  readonly __wbg_get_transactionutxoentry_scriptPublicKey: (a: number) => number;
  readonly __wbg_set_transactionutxoentry_scriptPublicKey: (a: number, b: number) => void;
  readonly __wbg_get_transactionutxoentry_blockDaaScore: (a: number) => number;
  readonly __wbg_set_transactionutxoentry_blockDaaScore: (a: number, b: number) => void;
  readonly __wbg_get_transactionutxoentry_isCoinbase: (a: number) => number;
  readonly __wbg_set_transactionutxoentry_isCoinbase: (a: number, b: number) => void;
  readonly __wbg_scriptpublickey_free: (a: number, b: number) => void;
  readonly __wbg_get_scriptpublickey_version: (a: number) => number;
  readonly __wbg_set_scriptpublickey_version: (a: number, b: number) => void;
  readonly scriptpublickey_constructor: (a: number, b: number, c: number) => void;
  readonly scriptpublickey_script_as_hex: (a: number, b: number) => void;
  readonly __wbg_hash_free: (a: number, b: number) => void;
  readonly hash_constructor: (a: number, b: number) => number;
  readonly hash_toString: (a: number, b: number) => void;
  readonly rustsecp256k1_v0_10_0_context_create: (a: number) => number;
  readonly rustsecp256k1_v0_10_0_context_destroy: (a: number) => void;
  readonly rustsecp256k1_v0_10_0_default_illegal_callback_fn: (a: number, b: number) => void;
  readonly rustsecp256k1_v0_10_0_default_error_callback_fn: (a: number, b: number) => void;
  readonly __wbg_address_free: (a: number, b: number) => void;
  readonly address_constructor: (a: number, b: number) => number;
  readonly address_validate: (a: number, b: number) => number;
  readonly address_toString: (a: number, b: number) => void;
  readonly address_version: (a: number, b: number) => void;
  readonly address_prefix: (a: number, b: number) => void;
  readonly address_set_setPrefix: (a: number, b: number, c: number) => void;
  readonly address_payload: (a: number, b: number) => void;
  readonly address_short: (a: number, b: number, c: number) => void;
  readonly initWASM32Bindings: (a: number, b: number) => void;
  readonly initConsolePanicHook: () => void;
  readonly initBrowserPanicHook: () => void;
  readonly presentPanicHookLogs: () => void;
  readonly defer: () => number;
  readonly __wbg_aborted_free: (a: number, b: number) => void;
  readonly __wbg_abortable_free: (a: number, b: number) => void;
  readonly abortable_new: () => number;
  readonly abortable_isAborted: (a: number) => number;
  readonly abortable_abort: (a: number) => void;
  readonly abortable_check: (a: number, b: number) => void;
  readonly abortable_reset: (a: number) => void;
  readonly setLogLevel: (a: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
