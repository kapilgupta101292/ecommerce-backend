const Product = require('../models/Product')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const { page, size} = req.query
    // Convert the query string values to numbers
    const pageNum = Number(page);
    const pageSize = Number(size);
    let products = [];
    const totalDocs = await Product.countDocuments();
    const totalPages = Math.ceil(totalDocs/pageSize);
    if (pageNum === 1) {
        products = await Product.find().limit(pageSize);
    } else {
        const skips = pageSize * (pageNum -1 );
        products = await Product.find().skip(skips).limit(pageSize);
    }
    res.status(200).json({products, totalPages})
});

module.exports = router;