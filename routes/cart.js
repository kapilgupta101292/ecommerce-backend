const Cart = require('../models/Cart')
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    if (!("authorization" in req.headers)) {
        return res.status(401).send("No authorization token");
    }
    try {
        const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const cart = await Cart.findOne({user: userId}).populate({
            path: 'products.product',
            model: 'Product'
        })
        res.status(200).json(cart.products);
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
});

router.put('/', async (req, res) => {
    const { quantity, productId } = req.body
    if (!("authorization" in req.headers)) {
        return res.status(401).send("No authorization token");
    }
    try {
        const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    
        // Get user cart based on userId
        const cart = await Cart.findOne({ user: userId })
        // check if product already exists in cart
        const productExists = cart.products.some(doc => ObjectId(productId).equals(doc.product));
        // if so , increment quantity
        if (productExists) {
            await Cart.findOneAndUpdate(
                { _id: cart._id, 'products.product': productId },
                { $inc: { 'products.$.quantity': quantity } }
            );
        } else {
            // if not so, add new product with given quantity
            const newProduct = { quantity, product: productId };
            await Cart.findOneAndUpdate(
                { _id: cart._id },
                { $addToSet: { products: newProduct } }
            )
        }
        res.status(200).send('cart updated');
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
})

router.delete('/', async (req, res) => {
    const {productId} = req.query;
    if (!("authorization" in req.headers)) {
        return res.status(401).send("No authorization token");
    }
    try {
        const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    
        // Get user cart based on userId
        const cart = await Cart.findOneAndUpdate(
            {user: userId},
            { $pull: {products: { product: productId}}},
            {new: true}
        ).populate({
            path: "products.product",
            model: "Product"
        });        
        res.status(200).json(cart.products);
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    } 
})

module.exports = router;