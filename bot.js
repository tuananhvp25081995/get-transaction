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
                        if (this.account == tx.to.toLowerCase()) {
                            const WebhookId = this.account
                            let address =  tx.from
                            let value = this.web3.utils.fromWei(tx.value, 'ether')
                            var time =  new Date();
                            console.log(address,value,time)
                            WebSocketService.sendToOneClient(userId, {
                                action: "transaction",
                                data: {
                                    WebhookId: WebhookId,
                                    address: address,
                                    value: value,
                                    time: time
                                }
                            });

                            // axios
                            //     .post(`http://localhost:3001/webhook/hook-bsc/${WebhookId}`, {
                            //         address,
                            //         value,
                            //         time
                            //     })
                            //     .then(function (response) {
                            //         result = response.data;
                            //         console.log("ok", result);
                            //     })
                            //     .catch(function (error) {
                            //         console.error(error);
                            //     });
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            }, 15000)
        });
    }
}

let txChecker = new TransactionChecker(process.env.INFURA_ID, '0x9e5B17d8D46B4Ba4e5F82A91628C27Fd162EbA2b');
txChecker.subscribe('pendingTransactions');
txChecker.watchTransactions();