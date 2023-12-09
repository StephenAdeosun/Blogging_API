const express = require('express');
const middleware = require('./blog_middleware.js');
const controller = require('./blog_controller.js');
const authMiddleware = require('../middleware/middleware.js');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router();


// router.get('/fetch',controller.GetBlogs);
router.get('/',controller.GetAllBlogs);
router.get('/:id',controller.GetBlogById);

router.use(authMiddleware.BearerTokenAuth);
router.get('/author', controller.GetBlogByAuthor);
router.post('/create',middleware.ValidateBlogCreation, controller.CreateBlog);
router.put('/:id/state', controller.UpdateBlogState);
router.patch('/:id/edit',middleware.ValidateBlogUpdate, controller.UpdateBlog);
router.delete('/:id/delete', controller.DeleteBlog);


module.exports = router;