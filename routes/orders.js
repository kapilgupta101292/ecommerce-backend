const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const orders = await Order.find({user: userId})
                        .sort({ createdAt: 'desc' })
                        .populate( {
                            path: 'products.product',
                            model: 'Product'
                        });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
});

module.exports = router;