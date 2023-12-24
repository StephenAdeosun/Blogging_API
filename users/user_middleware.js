const joi = require('joi')
const logger = require('../logger/logger.js')

const ValidateUserCreation = async (req, res, next) => {
    try {
        const schema = joi.object({
           first_name: joi.string().required().min(3).messages({
                'string.min': 'First Name must be at least 3 characters long',
                'any.required': 'First Name is required',
            }),
           last_name: joi.string().required().min(3).messages({
                'string.min': ' Last Name must be at least 3 characters long',
                'any.required': 'Last Name is required',
            }),
            password: joi.string().min(6).required().messages({
                'string.min': 'Password must be at least 6 characters long',
                'any.required': 'Password is required',
            }),
            email: joi.string().email().required().messages({
                'string.email': 'Invalid email format',
                'any.required': 'Email is required',
            }),
        })

        await schema.validateAsync(req.body, { abortEarly: true })
        logger.info('User Creation Validation Successful')
        next()
    } catch (error) {
        logger.error('User Creation Validation Failed', error)
        return res.status(422).json({
            // message: error.message,
            message: 'You are not authenticated!',
            success: false
        })
    }
}

const ValidateUserLogin = async (req, res, next) => {
    try {
        const schema = joi.object({
            password: joi.string().required(),
            email: joi.string().email().required(),
        })

        await schema.validateAsync(req.body, { abortEarly: true })
        // logger.info('User Login Validation Successful')
        next()
    } catch (error) {
        // logger.error('User Login Validation Failed', error)
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}




module.exports = {
    ValidateUserCreation,
    ValidateUserLogin
}

