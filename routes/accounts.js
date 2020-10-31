const User = require('../models/User');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    if (!("authorization" in req.headers)) {
        return res.status(401).send("No authorization token");
    }
    try {
        const {userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const user = await User.findOne({_id: userId});
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
        
    } catch(error) {
        res.status(403).send("Invalid token");
    }
});

router.put('/', async (req, res) => {
    try {
        const {_id, role} = req.body;
        await User.findOneAndUpdate({_id}, {role});
        res.status(203).send('User updated successfully');
    } catch(error) {
        res.status(403).send("Invalid token");
    }
});

module.exports = router;