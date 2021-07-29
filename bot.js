const Web3 = require('web3');
require('dotenv').config()
const axios = require("axios").default;
const WebSocketService = require("./services/ws.service");

class TransactionChecker {
    web3;
    web3ws;
    account;
    subscription;

    constructor(projectId, account) {
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider('wss://data-seed-prebsc-1-s1.binance.org:8545/'));
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));
        this.account = account.toLowerCase();
    }

    subscribe(topic) {
        this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
            if (err) console.error(err);
        });
    }

    watchTransactions() {
        console.log('Watching all pending transactions...');
        this.subscription.on('data', (txHash) => {
            setTimeout(async () => {
                try {
                    let tx = await this.web3.eth.getTransaction(txHash);
                    if (tx != null) {
                        if (tx.to && this.account == tx.to.toLowerCase()) {
                            let wsID = this.account
                            let address =  tx.from
                            let value = this.web3.utils.fromWei(tx.value, 'ether')
                            var time =  new Date();
                            WebSocketService.sendToAllClient({
                                action: "transaction",
                                data: {
                                    wsID: wsID,
                                    address: address,
                                    value: value,
                                    time: time
                                }
                            });
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            }, 15000)
        });
    }
}

let txChecker = new TransactionChecker(process.env.INFURA_ID, '0xD2d194294efbCa23972f6B6415B57ABA3F31B7Af');
txChecker.subscribe('pendingTransactions');
txChecker.watchTransactions();