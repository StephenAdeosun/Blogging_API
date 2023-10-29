const UserSchema = require('../model/UserModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const logger = require('../logger/logger')

const CreateUser = async (req, res) => {
    try {
        const userFromReq = req.body

        const existingUser = await UserSchema.findOne({ email: userFromReq.email })
        if (existingUser) {
            logger.error('User already exists')
            return res.status(409).json({
                success: false,
                message: 'User already exists',
            })
        }



        const user = await UserSchema.create({
            first_name: userFromReq.first_name,
            last_name: userFromReq.last_name,
            email: userFromReq.email,
            password: userFromReq.password,
        })
        logger.info('User created successfully')
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        if (user) {
            logger.info('User created successfully')
            return res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: { user, token }
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


const LoginUser = async (req, res) => {
    try{
    const userFromReq = req.body
    const user = await UserSchema.findOne({ email: userFromReq.email })
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: { user, token }
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






module.exports = {
    LoginUser,
    CreateUser
}