const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const Blacklisting = require("../model/blacklisting.model");
const redis = require("../config/cache");
const bcrypt = require("bcryptjs");

function isAdminUser(user) {
    if (!user?.email || !process.env.ADMIN_EMAIL) {
        return false;
    }

    return user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
}

function sanitizeUser(user) {
    if (!user) {
        return null;
    }

    return {
        ...user.toObject(),
        password: undefined,
        isAdmin: isAdminUser(user)
    };
}


const register = async (req, res) => {
    const { username = "", email = "", password = "" } = req.body || {};

    try {
        const userAlredyexist = await User.find({
            $or: [
                { email: email },
                { username: username }
            ]
        })

        if (userAlredyexist.length > 0) {
            return res.status(400).json({ message: "User already exist with this email or username" })
        }

        const hashedPasseword = bcrypt.hashSync(password, 10);

        const newUser = await User.create({
            username: username,
            email: email,
            password: hashedPasseword
        })

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "3d" })


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message: "User registered successfully",
            token: token,
            newUser: sanitizeUser(newUser)
        })

    }
    catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
}

const login = async (req, res) => {
    const { email = "", password = "" } = req.body || {};

    console.log("Login request received with email:", email);

    try {
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: email }
            ]
        }).select("+password")

        if (!user) {
            return res.status(400).json({ message: "Invalid email or username" })
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            message: "Login successful",
            token: jwtToken,
            user: sanitizeUser(user)
        })
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error during login" });
    }

}

const getme = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        };
        res.status(200).json({ message: "User found", user: sanitizeUser(user) })
    } catch (error) {
        console.error("Error during getme:", error);
        res.status(500).json({ message: "Server error during getme" });
    }
}

const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    })

    await redis.set(req.cookies.token, "blacklisted", "EX", 3 * 24 * 60 * 60)

    res.status(200).json({ message: "Logout successful" })
}


module.exports = {
    register,
    login,
    getme,
    logout
}
