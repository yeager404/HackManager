const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model.js");
const Panelist = require("../models/panelist.model.js");
const Hackathon = require("../models/hackathon.model.js")

require("dotenv").config();

// Signup Controller
exports.signup = async (req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = req.body;

        if(!firstName ||
            !lastName || 
            !email || 
            !password || 
            !confirmPassword
        ){
            return res.status(400).json({
                success: false,
                message: "All fields must be filled"
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false, 
                message: "Passwords don't match. Try again"
            })
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already Exists. Sign in to continue"
            })
        }

        // Hashing the password
        const hashedPw = await bcrypt.hash(password, 10);

        // Create the User
        const newUser = await User.create({
            firstName,
            lastName,
            email, 
            password: hashedPw
        })

        return res.status(200).json({
            succes: true, 
            message: "User registered Successfully"
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Try Again"
        })
    }
}

// Creator Login
exports.creatorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not registered. Sign Up to continue."
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { email: user.email, id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Send token as a cookie
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development", // false for local, true for prod
            sameSite: process.env.NODE_ENV !== "development" ? "None" : "Lax",
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        };

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            role: "Creator",
            message: "User Login Successful"
        });

    } catch (err) {
        console.error("Error in creatorLogin:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message || err
        });
    }
};

// Panelist Login 
exports.panelistLogin = async(req, res) => {
    try{
        const {email, hackathonID} = req.body;
        if(!email || !hackathonID){
            return res.status(400).json({
                success: false, 
                message: `All fields must be filled`
            })
        }

        const panelist = await Panelist.findOne({email});
        if(!panelist){
            return res.status(404).json({
                success: false, 
                message: "Panelist not found"
            })
        }

        const hackathon = await Hackathon.findById(hackathonID);
        if(!hackathon){
            return res.status(404).json({
                success: false,
                message: `Hackathon not found`
            })
        }

        if(!hackathon.panelists.includes(panelist._id)){
            return res.status(400).json({
                success: false,
                message: `Panelist not part of this Hackathon`
            })
        }

        return res.status(200).json({
            success: true,
            message: `Panelist verified successfully`,
            panelist: {
                id: panelist._id,
                name: panelist.name,
                email: panelist.email
            },
            hackathon: {
                id: hackathon._id,
                name: hackathon.name
            },
            role: "panelist"
        })

    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false, 
            message: `Internal Server Error (Panelist Login)`
        })
    }
}

// Auth Check Creator
exports.checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        return res.status(200).json({ success: true, user });
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};