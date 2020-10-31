const User = require('../models/User')
const Cart = require('../models/Cart')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const isEmail = require('validator/lib/isEmail')
const isLength = require('validator/lib/isLength')

router.post('/', async (req, res) => {
 const {name, email, password} = req.body;
    try {

        // 1) Validate name / email / password
        if (!isLength(name, {min: 3, max: 20})) {
            return res.status(422).send("Name must be 3-20 characters long");
        } else if(!isLength(password, {min: 6})) {
          return res.status(422).send("Password must be 6 characters long");  
        } else if (!isEmail(email)) {
            return res.status(422).send("Email must be valid");
        }
        // 2) check to see if the user already exists in the db.
        const user = await User.findOne({email});
        if (user) {
            return res.status(422).send(`User already exists with email ${email}`)
        }
        // 3) if not, hash their password
        const hash = await bcrypt.hash(password, 10);
        // 4) create user
        const newUser = await new User({name, email, password: hash}).save();
        // 5) create cart for new user
        await new Cart({ user: newUser._id}).save(); 
        // 6) create token for the new user
        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        // 6) send back the token.
        res.status(201).json(token);
    } catch(error) {
        console.error(error);
        res.status(500).send("Error signup user. Please try again later.")
    }
});

module.exports = router;