const UserModel = require('../model/UserModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const logger = require('../logger/logger')
const sendEmail = require('../utils/email')
const crypto = require('crypto')
const randToken = require('rand-token')
const { addMinutes, isAfter } = require('date-fns')

function generateToken() {
    const sixDigitToken = randToken.generate(6, '1234567890');
    return sixDigitToken;

}

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

        const activationCode = generateToken()
        const activationCodeExpires = addMinutes(new Date(), 60)

        const user = await UserModel.create({
            ...userFromReq,
            activationCode: activationCode,
            activationCodeExpires: activationCodeExpires,
            isActive: false
        })
        
        const message = `Welcome ${user.first_name} ${user.last_name} to my Blog App. Your activation code is ${activationCode}`
        const subject = `Welcome to Stephen's blog app`
        await sendEmail(message, user, subject)
       
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1hr' })
        // res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 })
        if (user) {
            logger.info('User created successfully')
            return res.status(201).json({
                success: true,
                message: 'User created successfully',
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

const ActivateUser = async (req, res) => {
  try {
    const {activationCode} = req.body
    const user = await UserModel.findOne({activationCode})
    if(!user){
        logger.error('User not found')
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }
     if (user.isActive){
        logger.error('User already activated')
        return res.status(409).json({
            success: false,
            message: 'User already activated'
        })
  }
  const codeExpires = isAfter(new Date(), user.activationCodeExpires)
    if (codeExpires){
        logger.error('Activation code expired')
        return res.status(400).json({
            success: false,
            message: 'Activation code expired'
        })
    }
    user.isActive = true
    await user.save()
    logger.info('User activated successfully')
    return res.status(200).json({
        success: true,
        message: 'User activated successfully',
    })
  } catch(error){
    logger.error('User activation failed', error)
    res.status(500).json({
        success: false,
        message: error.message,
    })

}
}



const LoginUser = async (req, res) => {
    try {
        const userFromReq = req.body
        const user = await UserModel.findOne({ email: userFromReq.email })
        if (!user) {
            logger.error('User not found')
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }  
        console.log(user)
        //       if (!user.isActive) {
        //     logger.error('User not activated')
        //     return res.status(400).json({
        //         success: false,
        //         message: 'User not activated'
        //     })
        // }
        const validPassword = await user.validatePassword(userFromReq.password)
        if (!validPassword) {
            logger.error('Invalid password')
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            })
        }
        console.log(validPassword)

        
        
        const token = jwt.sign({ id: user._id, username: user.first_name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1hr' })
        console.log(token)
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 })
        logger.info('User logged in successfully')
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
    try {
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
    try {
        user = req.user

        await UserModel.findByIdAndDelete(user._id)
        logger.info('User deleted successfully')
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        })

    } catch (error) {
        logger.error('User deletion failed', error)
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}






const ResetPasswordRequest = async (req, res) => {
    try {
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
        console.log(resetToken);
        const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();
        console.log(user.resetPasswordToken);
        console.log(user.resetPasswordExpires);

        // Send a password reset email to the user
        const resetURL = `https://curtisdev.netlify.app?token=${resetToken}`;
        const message = `You are receiving this email because you (or someone else) has requested for a password reset. Please make a PUT request to: \n\n ${resetURL}`;
        const subject = 'Password Reset Request';
        await sendEmail(message, user, subject);

        logger.info('Password reset email sent successfully')
        return res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully',
        });
    } catch (error) {
        logger.error('User reset password failed', error)
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}



const ResetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        // Find the user by the reset token and ensure it's not expired
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        // If user not found or token is expired, return an error
        if (!user) {
            logger.error('User not found or invalid/expired token');
            return res.status(404).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Update the user's password and clear reset token fields
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Save the updated user to the database
        await user.save();

        // Return a success response
        return res.status(200).json({
            success: true,
            message: 'Password reset successful',
        });

    } catch (error) {
        logger.error('User reset password failed', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    LoginUser,
    CreateUser,
    LogoutUser,
    DeleteUser,
    ResetPasswordRequest,
    ResetPassword,
    ActivateUser
}
