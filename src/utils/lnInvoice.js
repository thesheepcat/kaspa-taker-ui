import lightningPayReq from "bolt11";


export const decodeInvoice = (invoice) => {
    //const decoded = lightningPayReq.decode('lnbc20u1pvjluezhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqspp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqfppqw508d6qejxtdg4y5r3zarvary0c5xw7kxqrrsssp5m6kmam774klwlh4dhmhaatd7al02m0h0m6kmam774klwlh4dhmhs9qypqqqcqpf3cwux5979a8j28d4ydwahx00saa68wq3az7v9jdgzkghtxnkf3z5t7q5suyq2dl9tqwsap8j0wptc82cpyvey9gf6zyylzrm60qtcqsq7egtsq')
    const decoded = lightningPayReq.decode(invoice);
    console.log(decoded);
    let secretHash = "";
    for (let tag in decoded.tags) {
        //console.log(decoded.tags[tag]);
        if (decoded.tags[tag].tagName == "payment_hash") {
            //console.log("payment_hash");
            //console.log(decoded.tags[tag]);
            secretHash = decoded.tags[tag].data;
        }
    };
    const timelock = decoded.timeExpireDate * 1000;
    const satAmount = Number(decoded.satoshis);
    return ({
        secretHash: secretHash,
        satAmount: satAmount,
        timelock: timelock
    })
}