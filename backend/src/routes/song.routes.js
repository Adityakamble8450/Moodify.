const express = require('express');
const router = express.Router();
const {uploadSong, getSong , getMoodPlaylist} = require('../controllers/songs.controller');
const uploadMiddleware = require('../middelware/multer.middelware');



router.post('/', uploadMiddleware.single('song'), uploadSong);

router.get('/', getSong);

router.get("/playlist/:mood", getMoodPlaylist);



module.exports = router;