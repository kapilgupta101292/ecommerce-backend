const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema.Types;

const CartSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "User" 
    },
    products: [
        {
            quantity: {
                type: Number,
                default: 1
            },
            product: {
                type: ObjectId,
                ref: 'Product'
            }
        }
    ]
})

module.exports = mongoose.model('Cart', CartSchema);
