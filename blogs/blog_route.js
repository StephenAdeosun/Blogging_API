const express = require('express');
const middleware = require('./blog_middleware.js');
const controller = require('./blog_controller.js');
const authMiddleware = require('../middleware/middleware.js');

const router = express.Router();


// router.get('/fetch',controller.GetBlogs);
router.get('/',controller.GetAllBlogs);
router.get('/author',authMiddleware.BearerTokenAuth, controller.GetBlogByAuthor);
router.get('/:id',controller.GetBlogById);
router.post('/create',authMiddleware.BearerTokenAuth,middleware.ValidateBlogCreation,controller.CreateBlog);
router.put('/:id/state',authMiddleware.BearerTokenAuth, controller.UpdateBlogState);
router.patch('/:id/edit',authMiddleware.BearerTokenAuth,middleware.ValidateBlogUpdate, controller.UpdateBlog);
router.delete('/:id/delete',authMiddleware.BearerTokenAuth, controller.DeleteBlog);


module.exports = router;