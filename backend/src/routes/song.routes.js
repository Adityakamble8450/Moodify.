const express = require('express');
const router = express.Router();
const {uploadSong, getSong} = require('../controllers/songs.controller');
const uploadMiddleware = require('../middelware/multer.middelware');



router.post('/', uploadMiddleware.single('song'), uploadSong);

router.get('/', getSong);



module.exports = router;