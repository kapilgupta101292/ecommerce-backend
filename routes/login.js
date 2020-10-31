const User = require('../models/User');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/', async (req, res) => {
     const {email, password} = req.body;
     try {
        // 1) check to see if a user exists with the provided email
        const user = await User.findOne({email}).select('+password');
        // 2) -- if not, return errorMsg
        if (!user) {
            return res.status(404).send("No user exists with the provided email");
        }
        // 3) check to see if user's password matches the one in db.
        const passwordsMatch = await bcrypt.compare(password, user.password);
        // 4) -- if so, generate a token
        if (passwordsMatch) {
            const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
                expiresIn: '7d'})
            // 5) send that token to the client;
        res.status(200).json(token);
        } else {
            res.status(401).send("Passwords do not match")
        }        
     } catch (error) {
        console.error(error)
        res.status(500).send('Error loggin in');
     }
});

module.exports = router;