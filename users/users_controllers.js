const UserModel = require('../model/UserModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const logger = require('../logger/logger')
const sendEmail = require('../utils/email')
const crypto = require('crypto')

const CreateUser = async (req, res) => {
    try {
        const userFromReq = req.body

        const existingUser = await UserModel.findOne({ email: userFromReq.email })
        if (existingUser) {
            logger.error('User already exists')
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists',
            })
        }


        const user = await UserModel.create(userFromReq)
        const message = `Welcome ${user.first_name} ${user.last_name} to Blog App`
        await sendEmail(message, user)
        logger.info('User created successfully')
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1hr' })

        if (user) {
            logger.info('User created successfully')
            return res.status(201).json({
                success: true,
                message: 'User created successfully',
                // data: { user, token }
            })
        }

    }
    catch (error) {
        logger.error('User creation failed', error)
        res.status(500).json({
            success: false,
            message: error.message,
        })

    }
}

// store user to cookie



const LoginUser = async (req, res) => {
    try{
    const userFromReq = req.body
    const user = await UserModel.findOne({ email: userFromReq.email })
    if (!user){
        logger.error('User not found')
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }
    const validPassword = await user.validatePassword(userFromReq.password)
    if (!validPassword){
        logger.error('Invalid password')
        return res.status(400).json({
            success: false,
            message: 'Invalid password'
        })
    }
    logger.info('User logged in successfully')
    const token = jwt.sign({ id: user._id, username: user.first_name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1hr' })
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 })
    return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
    })
}
catch (error) {
    logger.error('User login failed', error)
    res.status(500).json({
        success: false,
        message: error.message,
    })
}
}

const LogoutUser = async (req, res) => {
    try{
    res.cookie('jwt', '', { maxAge: 1 })
    logger.info('User logged out successfully')
    return res.status(200).json({
        success: true,
        message: 'User logged out successfully',
    })
}
catch (error) {
    logger.error('User logout failed', error)
    res.status(500).json({
        success: false,
        message: error.message,
    })
}
}

const DeleteUser = async (req, res) => {
try{
    user = req.user
     
    await UserModel.findByIdAndDelete(user._id)
    logger.info('User deleted successfully')
    return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    })

}catch (error) {
    logger.error('User deletion failed', error)
    res.status(500).json({
        success: false,
        message: error.message,
    })
}
}	

const ResetPasswordRequest = async (req, res) => {
    try{
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            logger.error('User not found')
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Send a password reset email to the user
        const resetURL = `http://localhost:7000/reset-password/${resetToken}`;
        const message = `You are receiving this email because you (or someone else) has requested for a password reset. Please make a PUT request to: \n\n ${resetURL}`;
        const subject = 'Password Reset Request';
        await sendEmail(message, user, subject);

        logger.info('Password reset email sent successfully')
        return res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully',
        });
    }catch (error) {
        logger.error('User reset password failed', error)
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}





module.exports = {
    LoginUser,
    CreateUser,
    LogoutUser,
    DeleteUser,
    ResetPasswordRequest
}