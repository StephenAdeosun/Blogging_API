const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express()

const port = 8000

// middleware 
app.use(express.static('public'))

const pageFound = path.join(__dirname, 'public', 'index.html')
const PageNotFound = path.join(__dirname, 'public', 'error.html')

const handleSuccessPage = async (req, res) => {
    const filePage = await fs.readFileSync(pageFound)
    res.status(200)
    res.sendFile(filePage)
}

app.get('/index.html', handleSuccessPage)

app.get('*', async (req, res) => {
    try {
        res.sendFile(PageNotFound)
    } catch (error) {
        // res.sendFile(PageNotFound)
    }
})


app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
