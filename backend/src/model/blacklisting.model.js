const mongoose = require("mongoose");

const blacklistingSchema = new mongoose.Schema({
    token : {
        type : String,
        required : [true, "Token is required"] 
    
    }
}, {timestamps : true})

const Blacklisting = mongoose.model("Blacklisting" , blacklistingSchema)
module.exports = Blacklisting

