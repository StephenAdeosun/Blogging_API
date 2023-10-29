const mongoose = require ("mongoose")
require("dotenv").config()
const logger = require("../logger/logger.js")

function connect(){
    mongoose.connect(process.env.DB_URL)

    mongoose.connection.on("connected", ()=>{
        logger.info("database connection is successful")
        console.log("database connection is successful")
    })

    mongoose.connection.on("error", (err)=>{
        logger.error("database connection failed", err)
        console.log("database connection failed", err)
    })
}

module.exports = {connect}