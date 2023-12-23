const multer = require('multer');

module.exports = multer({
    storage: multer.diskStorage({}),
    limits: { fileSize: 2 * 1024 * 1024 } // 2 megabytes in bytes
});