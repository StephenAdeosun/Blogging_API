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




const authenticateUser = async (req, res, next) => {
  // Check if the request contains a token
  const token = req.cookies.jwt;

  if (!token) {
    // No token found, user is not logged in
    return res.status(401).json({ success: false, message: 'Unauthorized: User not logged in' });
  }

  try {
    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded token information
    const user = await UserModel.findById(decodedToken.id);

    if (!user) {
      // User not found
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid user' });
    }

    // Set user information in the request object for further use
    req.user = user;
    next();
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticateUser;


module.exports = {BearerTokenAuth, authenticateUser}