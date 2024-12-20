import jwt from 'jsonwebtoken';
import User from '../models/userModel.mjs';

export const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log("Username is taken");
            return res.status(400).json({ message: 'User already exists' });
        } 

        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
        console.log("User registered successfully!");
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
    
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    console.log("Verifying token...");
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log("Invalid credentials!");
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.isPasswordValid(password);
        if (!isMatch) {
            console.log("Invalid credentials!");
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
        console.log("Token verified!");
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyUser = async (req, res) => {
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Send a response indicating that the token is valid
        res.status(200).json({ valid: true, user: decoded });
    } catch (err) {
        // Send an error response if the token is invalid or expired
        res.status(401).json({ valid: false, message: 'Invalid or expired token' });
    }
};
