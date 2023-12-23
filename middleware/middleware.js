const jwt = require('jsonwebtoken')
const UserModel = require('../model/UserModel')
const logger = require('../logger/logger')

const BearerTokenAuth = async (req, res, next) => {
   try{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        logger.error('You are not authenticated!, Please log in')
        return res.status(401).json({ message: 'You are not authenticated!, Please log in' });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
} catch(error){
        logger.error('You are not authenticated!',error)
        return res.status(401).json({ message: 'You are not authenticated!, Wrong key' });
    }
}

const basicAuthUsernamePassword = async (req, res, next) => {

    

}

module.exports = {BearerTokenAuth}