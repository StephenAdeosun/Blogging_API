const app = require('./api')
const port = process.env.PORT || 8000
const {connect} = require('./db/index')
connect()
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
    }
)