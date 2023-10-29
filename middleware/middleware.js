const fs =  require('fs')
const jwt = require('jsonwebtoken')
const UserModel = require('../model/UserModel')

const apiKeyAuth = (req, res, next) => {
    const userData = fs.readFileSync('./users/users.json')
    const userDataJson = JSON.parse(userData)
    const authHeader = req.headers;

    if (!authHeader.api_key) {
        return res.status(401).json({ message: 'You are not authenticated!' });
    }

    const existingUser = userDataJson.find(user => user.api_key === authHeader.api_key)
    if (existingUser) {
        req.user = existingUser
        next();
    } else {
        return res.status(401).json({ message: 'You are not authenticated!' });
    }
}

const BearerTokenAuth = async (req, res, next) => {
   try{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({ message: 'You are not authenticated!' });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ _id: decodedToken.id })
// console.log(user)
    if(!user){
        return res.status(401).json({ message: 'You are not authenticated!' });
    }
    req.user = user;
    next();
} catch(error){
        return res.status(401).json({ message: 'You are not authenticated!' });
    }
}


const checkAdmin =(req, res, next) => {   
    const userData = fs.readFileSync('./users/users.json')
    const userDataJson = JSON.parse(userData)
    const apiKeyAuth = req.headers.api_key;
    const user = userDataJson.find(user => user.api_key === apiKeyAuth)
    if (user.role === 'admin') {
        next()
    } else {
        res.status(401).send('Unauthorized')
    }
}


const checkUser = (req,res,next)=>{
    const userData = fs.readFileSync('./users/users.json')
    const userDb = JSON.parse(userData)
    const authHeader = req.headers.api_key

    const existingUser = userDb.find(user => user.api_key === authHeader)
    if(existingUser.role === 'user'){
        next()
    }
    else{
        res.status(401).send('You are not  Authorized')
    }
}

module.exports = {checkAdmin, apiKeyAuth ,BearerTokenAuth, checkUser}