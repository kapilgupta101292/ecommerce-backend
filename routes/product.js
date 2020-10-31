const Product = require('../models/Product')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const { _id }  = req.query;
    const product = await Product.findOne({ _id });
    res.status(200).json(product); 
});

router.post('/', async (req, res) => {
      const {name, price, description, mediaUrl} = req.body
     try {
        if (!name || !price || !description || !mediaUrl) {
            return res.status(422).send("Product missing one or more fields");
        }
        const product = await new Product({
            name,
            price,
            description,
            mediaUrl
        }).save();
        res.status(201).json(product);
    } catch(error) {
        console.error(error);
        res.status(500).send("Server error in creating product");
    }
})

router.delete('/', async (req, res) => {
   try {
        const { _id }  = req.query;
        // 1) Delete product by id
        await Product.findOneAndDelete({ _id });
        // 2) Remove product from all carts, referenced as 'product'
        await Cart.updateMany(
            {'products.product': _id},
            { $pull: { products: {product: _id}}}
        )
        res.status(204).json({});    
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting the product');
    }
})

module.exports = router;