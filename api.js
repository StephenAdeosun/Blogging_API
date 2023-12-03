const express = require('express')
const usersRouter = require('./users/users_route.js');
const blogRouter = require('./blogs/blog_route.js');
const logger = require("./logger/logger.js")    
const app = express()
const rateLimit = require('express-rate-limit');

app.use(express.json())


// user routes
app.use('/', usersRouter);

// blog routes
app.use('/blog/', blogRouter);


const limiter = rateLimit({
	windowMs: 0.5 * 60 * 1000, // 30seconds
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header.
});


app.use(limiter)


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