const mongoose = require ("mongoose")
require("dotenv").config()

function connect(){
    mongoose.connect(process.env.DB_URL)

    mongoose.connection.on("connected", ()=>{
        console.log("database connection is successful")
    })

    mongoose.connection.on("error", (err)=>{
        console.log("database connection failed", err)
    })
}

module.exports = {connect}