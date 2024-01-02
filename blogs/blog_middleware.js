const joi = require('joi')
const logger = require("../logger/logger.js")
const cloudinary = require('../integrations/cloudinary.js')
const fs = require('fs')
const path = require('path')

const ValidateBlogCreation = async (req, res, next) => {
    console.log(req.body)
    try {
        const schema = joi.object({
            title: joi.string().required().min(3).messages({
                'string.min': 'Title must be at least 3 characters long',
                'any.required': 'Title is required',
            }),
            body: joi.string().required().min(3).messages({
                'string.min': 'Body must be at least 3 characters long',
                'any.required': 'Body is required',
            }),
            description: joi.string().min(3).messages({
                'string.min': 'Description must be at least 3 characters long',
                'any.required': 'Description is required',
            }),
            tags: joi.string().min(3).messages({
                'string.min': 'Tags must be at least 3 characters long',
                'any.required': 'Tags is required',
            }),
            state: joi.string().min(3).messages({
                'string.min': 'State must be at least 3 characters long',
                'any.required': 'State is required',
            }),

        })

        await schema.validateAsync(req.body, { abortEarly: true })
        logger.info('Blog Creation Validation Successful')
        next()
    } catch (error) {
        logger.error('Blog Creation Validation Failed', error)
        return res.status(422).json({
            message: error.message,
            // message: 'Blog Creation Validation Failed',

            success: false
        })
    }
}

const ValidateBlogUpdate = async (req, res, next) => {
    try {
        const schema = joi.object({
            title: joi.string().min(3).messages({
                'string.min': 'Title must be at least 3 characters long',
                'any.required': 'Title is required',
            }),
            body: joi.string().min(3).messages({
                'string.min': 'Body must be at least 3 characters long',
                'any.required': 'Body is required',
            }),
            description: joi.string().min(3).messages({
                'string.min': 'Description must be at least 3 characters long',
                'any.required': 'Description is required',
            }),
            tags: joi.string().min(3).messages({
                'string.min': 'Tags must be at least 3 characters long',
                'any.required': 'Tags is required',
            }),
            state: joi.string().min(3).messages({
                'string.min': 'State must be at least 3 characters long',
                'any.required': 'State is required',
            }),

        })

        await schema.validateAsync(req.body, { abortEarly: true })
        logger.info('Blog Update Validation Successful')
        next()
    } catch (error) {
        logger.error('Blog Update Validation Failed', error)
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}

const fileUpload = async (file) => {

  await cloudinary.uploader.upload(file, (err, fileData) => {
        if (err) {
            logger.error(err)

        }
        fs.unlinkSync(file)

        if (fileData) {
            return fileData
        }

    })

}


module.exports = {
    ValidateBlogCreation,
    ValidateBlogUpdate,
    fileUpload

}
