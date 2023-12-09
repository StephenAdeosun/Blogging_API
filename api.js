const express = require('express')
const usersRouter = require('./users/users_route.js');
const blogRouter = require('./blogs/blog_route.js');
const logger = require("./logger/logger.js")
const app = express()
const rateLimit = require('express-rate-limit');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs')
const path = require('path')
const cloudinary = require('./integrations/cloudinary.js')

app.use(express.json())


// user routes
app.use('/', usersRouter);

// blog routes
app.use('/blog/', blogRouter);


app.post('/file/upload', upload.single('file'), async (req, res, next) => {
// BlogModel.profileImage = req.file.path
// BlogModel.save()
  await cloudinary.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      logger.error(err)
      return res.status(500).json({
        data: null,
        error: 'Something went wrong'
      })
    }
    fs.unlinkSync(req.file.path)
    req.file = result

    if (result) {console.log(result.secure_url)
      return res.status(200).json({
        data: result.secure_url,
        error: null
      })
      
    }

  })
})

const file = path.join(__dirname, 'public', 'index.html')
app.get('/file/form', (req, res) => {
  res.sendFile(file)
})

const limiter = rateLimit({
  windowMs: 0.5 * 60 * 1000, // 30seconds
  limit: 5, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header.
});


app.use(limiter)


app.get('/', (req, res) => {
  res.send('You are welcome to the blog app ')
})


app.get('*', (req, res) => {
  logger.error('Route not found')
  return res.status(404).json({
    data: null,
    error: 'Route not found'
  })
})


module.exports = app;