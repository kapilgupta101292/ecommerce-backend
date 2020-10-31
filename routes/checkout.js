const Cart = require('../models/Cart')
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
     const {paymentData } = req.body;
    try {
        // 1) Verify and get the user cart from the token
        const {userId} = jwt.verify(req.headers.authorization, 
            process.env.JWT_SECRET);
        // 2) Find cart based on user id, populate it
        const cart = await Cart.findOne({user: userId}).populate({
            path:"products.product",
            model: "Product"
        });
        // 3) Calculate cart totals again from cart products
        const {cartTotal, stripeTotal} = calculateCartTotal(cart.products);
        // 4) Get the email for payment data, see if email is linked with 
        const prevCustomer = await stripe.customers.list({
            email: paymentData.email,
            limit: 1
        });
        const isExistingCustomer = prevCustomer.data.lenght > 0;
        // existing stripe customer.
        // 5) if not existing customer, create them based on their email
        let newCustomer;
        if (!isExistingCustomer) {
            newCustomer = await stripe.customers.create({
                email: paymentData.email,
                source: paymentData.id
            })
        }
        const customer = (isExistingCustomer && prevCustomer.data[0].id) ||
        newCustomer.id;
        // 6) create charge with total, send receipt email.
        const charge = await stripe.charges.create({
            currency:"usd",
            amount: stripeTotal,
            receipt_email: paymentData.email,
            customer,
            description: `Checkout | ${paymentData.email} | ${paymentData.id}`
        }, {
            idempotency_key: uuidv4()
        })
        // 7) Add order data to db
        await new Order({
            user: userId,
            email: paymentData.email, 
            total: cartTotal,
            products: cart.products
        }).save();
        // 8) Clear products in cart
        await Cart.findOneAndUpdate(
            {_id: cart._id},
            {$set: {products: []}}
        )
        // 9) Send back success (200) response 
        res.status(200).send("Checkout successful");
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing charge');
    }
})

module.exports = router;