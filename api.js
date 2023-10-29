const express = require('express')
const usersRouter = require('./users/users_route.js');
const blogRouter = require('./blogs/blog_route.js');
const logger = require("./logger/logger.js")    
const app = express()


app.use(express.json())


// user routes
app.use('/', usersRouter);

// blog routes
app.use('/blog/', blogRouter);

app.get('/', (req, res) => {
  res.send('You are welcome to the blog app ')
})


app.get('*', (req, res) => {
    logger.error('Route not found')
    return res.status(404).json({
        data: null,
        error: 'Route not found'
    })
})


module.exports = app;