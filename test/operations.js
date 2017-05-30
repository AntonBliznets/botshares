import {Apis} from "bitsharesjs-ws";
import {ChainStore, FetchChain, PrivateKey, TransactionHelper, Aes, TransactionBuilder} from "../lib";
const BOTname = "v0id";
const KEY = "5KiJhLohVotPizdecEtoNeKluchOkfuFtdyiKVgfdyuRo";
const pKey = PrivateKey.fromWif(KEY);
const SELLorder = {
            amount: 1,
            asset: "BTS"
        }
const BUYorder = {
            amount: 1,
            asset: "USD"
        }
const FEEorder = {
		amount: 0,
        asset: "BTS"
	}
let expire = "2020-02-02T02:02:02"

Apis.instance("wss://bitshares.openledger.info/ws", true)
.init_promise.then((res) => {
console.log(`CONNECTED TO: ${res[0].network_name}`);
	ChainStore.init().then(() => {
			Promise.all([
                FetchChain("getAccount", BOTname),
                FetchChain("getAsset", BUYorder.asset),
				FetchChain("getAsset", SELLorder.asset),
				FetchChain("getAsset", FEEorder.asset)
            ]).then((result)=> {
              let [BOT, BUY, SELL, FEE] = result;
			  let tr = new TransactionBuilder()
			  
               tr.add_type_operation( "limit_order_create", {
                    fee: {
                        amount: 0,
                        asset_id: FEE.get("id")
                    },
                    seller: BOT.get("id"),
					amount_to_sell:{ 
						amount: SELLorder.amount, 
						asset_id: SELL.get("id") 
					},
					min_to_receive: {
						amount: BUYorder.amount, 
						asset_id: BUY.get("id") 
					},
					expiration: expire,
					fill_or_kill: false,
					extensions: []
					}
                    
                )
				
				let StelthTRX = new TransactionBuilder()
				
				StelthTRX.add_type_operation( "blind_transfer", {
				    fee: {
					amount: 0,
					asset_id: FEE.get("id")
				    },

							inputs: {
								// To Do
							},
							outputs: {
								// To Do
							}
							}

				)
				
				
				tr.set_required_fees().then(() => {
                    tr.add_signer(pKey, pKey.toPublicKey().toPublicKeyString());
					console.log(`BROADCAST >>>`);
                    tr.broadcast();
					})
            });
    });
});
