const express = require('express');
const middleware = require('./blog_middleware.js');
const controller = require('./blog_controller.js');
const authMiddleware = require('../middleware/middleware.js');
const cloudinary = require('../integrations/cloudinary.js');
const blogModel = require('../model/BlogModel.js');
const logger = require('../logger/logger.js');
const path = require('path');



const router = express.Router();


router.get('/',controller.GetAllBlogs);
router.get('/:id',controller.GetBlogById);

router.use(authMiddleware.authenticateUser);
router.get('/author', controller.GetBlogByAuthor);
router.put('/:id/state', controller.UpdateBlogState);
router.patch('/:id/edit',middleware.ValidateBlogUpdate, controller.UpdateBlog);
router.delete('/:id/delete', controller.DeleteBlog);

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Set the filename 
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB (adjust as needed)
});

router.post('/create-blog',authMiddleware.authenticateUser, upload.single('blogImage'),controller.createBlog);



module.exports = router;













