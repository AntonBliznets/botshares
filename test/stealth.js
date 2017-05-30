import {Apis} from "bitsharesjs-ws";
import {ChainStore, FetchChain, PrivateKey, TransactionHelper, Aes, TransactionBuilder} from "../lib";
const BOTname = "v0id";
const KEY = "5LkIkkfEtoNihuyaNeKluchEtoProstoNaborHerniWeilo";
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
			
				
				let StealthTRX = new TransactionBuilder()
				StealthTRX.add_type_operation( "transfer_to_blind", {
                    fee: {
                        amount: 2,
                        asset_id: FEE.get("id")
                    },
					
					amount: { 
						amount: 10, 
						asset_id: SELL.get("id") 
					},
					from: BOT,
					blinding_factor: "wbZwBPctSqolDEnMsSpRnrLrSUbicJJa",
					outputs: {
						commitment: "dwsbroeBnbCYjDNGDJyRYJuteorynFzqD",
						range_proof: "",
						owner: {
						"weight_threshold":1,
						"account_auths":[],
						"key_auths":[["BTS6YN2QwGYAUU1zZf29Gb1raBfzPRWqcmdkJ5wfLYgnvb4w3ojgS",1]],
						"address_auths":[]
						}
						
					}
	
					}
                    
                )
				
				StealthTRX.set_required_fees().then(() => {
                    StealthTRX.add_signer(pKey, pKey.toPublicKey().toPublicKeyString());
					console.log(`BROADCAST Stealth >>>`);
                   StealthTRX.broadcast();
					})
            });
    });
});
