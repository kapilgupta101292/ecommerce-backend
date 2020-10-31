const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema.Types;

const OrderSchema = new mongoose.Schema({
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
    ],
    email: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Order', OrderSchema);
