import {User} from "../model/user.js";
import jwt from "jsonwebtoken";
import argon2  from "argon2"
import "dotenv/config";
const signIn = async (req, res) => {
    const { name, email, password ,phoneNumber, role} = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash the password
        const hash = await argon2.hash(password);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hash,
            phoneNumber,
            role: role || "user", 
        });

        // Save the user to the database
        await newUser.save();

        // Respond with success message
        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        // Handle errors
        res.status(500).json({ msg: "Error in registration", error: err.message });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Verify the password
        const valid = await argon2.verify(userExists.password, password);
        if (!valid) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                username: userExists.username,
                email: userExists.email,
                userId: userExists._id
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        // Respond with success message and token
        res.status(200).json({ msg: "Logged in successfully", token });
    } catch (err) {
        // Handle errors
        res.status(500).json({ msg: "Error in login", error: err.message });
    }
};
export { signIn, login };