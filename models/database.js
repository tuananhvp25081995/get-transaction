let mongoose = require("mongoose");
let sparkles = require("sparkles")()
require('dotenv').config()
var dbconnect = function () {
    let mongoOption = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 1,
        useFindAndModify: false,
    };

    console.log("server start!");
    mongoose
        .connect(process.env.MONGO_URL, mongoOption)
        .then((a) => {
            console.log("DB has connect!");

            sparkles.emit("init");

            let database = mongoose.connection;

            database.on(
                "error",
                console.error.bind(console, "MongoDB connection error:")
            );

            database.on("connecting", () => {
                console.log("Error connecting db");
            });

            database.on("open", function () {
                console.log("Connected to mongo server.");
            });

            database.on("connecting", () => {
                console.log("Db connecting");
            });

            database.on("disconnected", () => {
                console.log("Db disconnected");
            });

            database.on("reconnectFailed", () => {
                console.log("Db reconnectFailed");
            });

            database.on("reconnected", () => {
                console.log("Db reconnected!");
            });
        })
        .catch((err) => {
            console.error(err);
        });
};
exports.connect = dbconnect;
