const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const redis = require("../config/cache");



const authMiddleware = async (req , res , next) =>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json(({message : "Unauthorized , no token provided"}))
    }

    const isBlacklisted = await redis.get(token);

    if(isBlacklisted){
        return res.status(401).json({message : "Unauthorized , token is blacklisted"})
    }

    try{
        const decoded = jwt.verify(token  , process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).json({message : "Unauthorized , invalid token"})
    }
}

module.exports = authMiddleware;

