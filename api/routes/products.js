const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'hi from product'
    });
})

router.post('/', (req, res, next) => {
    // const product={
    //     name:req.body.name,
    //     price:req.body.price
    // };  
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })

    product.save().then(result => {
        console.log(result);
        res.status

    }).catch(err => console.log(err));

    res.status(200).json({
        message: "the post request send succefully",
        createProduct: product
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc=>{
        console.log(doc);
        res.status(200).json(doc)
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err})
        })
    });
    // if (id === 'special') {
    //     res.status(200).json({
    //         message: 'You send Special Id',
    //         Id: id
    //     })
    // } else {
    //     res.status(200).json({
    //         message: 'you send Id'
    //     })
    // }


router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'product update succefully'
    })
})

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Product is deleted succefully'
    })
})

module.exports = router;