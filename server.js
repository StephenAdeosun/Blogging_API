const app = require('./api')
const logger = require("./logger/logger.js")
const port = process.env.PORT || 7000
const {connect} = require('./config/config.js')
connect()
logger.info("Server is starting")
app.listen(port, () => {
    logger.info(`Server listening at http://localhost:${port}`)
    console.log(`Server listening at http://localhost:${port}`)
    }
)