const Web3 = require('web3');
require('dotenv').config()
const axios = require("axios").default;
const WebSocketService = require("./services/ws.service");
const event = require("./controllers/eventController")
let Websocket = require('ws')
const web3 = new Web3();
web3.setProvider(new web3.providers.WebsocketProvider('wss://speedy-nodes-nyc.moralis.io/9350000a43e8c70ad1fe86db/bsc/testnet/ws'));
// const web3ws = new Web3(new Web3.providers.WebsocketProvider('wss://data-seed-prebsc-1-s1.binance.org:8545/'));
// const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));

let wss;
let wsID;
let address;
let value;
var time;
wss = new Websocket.Server({ port: 8081 });
wss.once('connection', function (ws, req) {
    ws.once('message', function incoming(message) {
        // pendingTransactions
        web3.eth.subscribe('pendingTransactions', function(error, result){
        })
        .on("data", function(transaction){
        web3.eth.getTransaction(transaction)
            .then(res => {
                if (res && res.to === message) {
                    wsID = res.to
                    address =  res.from
                    value = web3.utils.fromWei(res.value, 'ether')
                    time =  new Date();
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
            });
        });
    })
})
