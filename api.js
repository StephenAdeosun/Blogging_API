const express = require('express')
const usersRouter = require('./users/users_route.js');
const {connect} = require('./config/config')
const UserModel = require('./model/UserModel');
const BlogModel = require('./model/BlogModel');
const blogRouter = require('./blogs/blog_route.js');
// create an express application
connect()
const app = express()

//port
const port = 7000;

// middleware
app.use(express.json())


// user creation
app.use('/', usersRouter);
app.use('/blog', blogRouter);



app.get('*', (req, res) => {
    return res.status(404).json({
        data: null,
        error: 'Route not found'
    })
})



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
    }
)

module.exports = app;