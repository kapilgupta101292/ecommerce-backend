const express = require('express');
const app = express();
const cors = require('cors')
const account = require('./routes/account');
const cart = require('./routes/cart');
const checkout = require('./routes/checkout');
const login = require('./routes/login');
const orders = require('./routes/orders');
const product = require('./routes/product');
const products = require('./routes/products');
const signup = require('./routes/signup');
const users = require('./routes/users');
const mongoose = require('mongoose');
const winston = require('winston');
const dotenv = require('dotenv');
dotenv.config();
require('./logging')();


app.use(express.json());
app.use(cors())

app.use('/api/account', account);
app.use('/api/cart', cart);
app.use('/api/checkout', checkout);
app.use('/api/login', login);
app.use('/api/orders', orders);
app.use('/api/product', product);
app.use('/api/products', products);
app.use('/api/signup', signup);
app.use('/api/users', users);
 
mongoose
    .connect(process.env.MONGO_SRV, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(winston.info('Connected to MongoDB...'));

app.listen(process.env.PORT);
winston.info(`Server listening to Port ${process.env.PORT}`);