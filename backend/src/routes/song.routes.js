const express = require('express');
const router = express.Router();
const {uploadSong, getSong , getMoodPlaylist, getAdminSongs} = require('../controllers/songs.controller');
const uploadMiddleware = require('../middelware/multer.middelware');
const authMiddleware = require('../middelware/auth.middelware');
const adminMiddleware = require('../middelware/admin.middelware');

router.get('/', getSong);

router.get("/playlist/:mood", getMoodPlaylist);

router.get("/admin/list", authMiddleware, adminMiddleware, getAdminSongs);

router.post('/', authMiddleware, adminMiddleware, uploadMiddleware.single('song'), uploadSong);



module.exports = router;
