const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    address: {type: String, default: ""}
},{
    timestamps: true,
    versionKey: false
})

mongoose.model("AddressModel", UserSchema, "address");