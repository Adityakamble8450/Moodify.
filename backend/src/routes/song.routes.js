const express = require('express');
const router = express.Router();
const {uploadAudio , getSongs} = require('../controllers/songs.controller');
const uploadMiddleware = require('../middelware/multer.middelware');



router.post('/', uploadMiddleware.single('song'), uploadAudio);

router.get('/', getSongs);



module.exports = router;