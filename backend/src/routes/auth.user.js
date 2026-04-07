const express = require("express");
const router = express.Router();
const {register , login , getme , logout}  = require("../controllers/auth.controller");
const authMiddleware = require("../middelware/auth.middelware");



router.post("/register", register)
router.post("/login", login)
router.get("/get-me" , authMiddleware , getme)
router.get("/logout" , authMiddleware , logout)



module.exports = router;
