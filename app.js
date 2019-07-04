const express = require('express')

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://root:' + process.env.MONGO_ATLAS_PW + '@node-rest-wwt7d.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true })

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With , Content-Type ,Accept ,Authoriuzation');
    if (req.method === 'OPTIONS') {
        req.header('Access-Control-Allow-Methods', 'PUT , POST, PATCH ,DELETE ,GET');
        res.status(200).json({});
    }
    next()
});

const userRoutes = require('./api/routes/users')
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const studentRourtes=require('./api/routes/student')
app.use('/user', userRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/student',studentRourtes)
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;