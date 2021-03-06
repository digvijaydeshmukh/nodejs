const express = require("express");
const router = express.Router();
const mongooes = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product')
router.get('/', (req, res, next) => {
    Order.find().select("product quantity _id").populate('product', 'name').exec().then(docs => {
        console.log(docs)
        if (!order) {
            return res.status(404).json({
                message: "orders not found"
            })
        }

        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            }),

        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })

})

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId).then(product => {
        if (!product) {
            return releaseEvents.status(404).json({
                message: 'Product Not Found'
            })
        }
        const order = new Order({
            _id: mongooes.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save()
    }).then(result => {
        console.log(result)
        res.status(201).json({
            message: "order created",
            createOrder: {
                _id: result._id,
                productId: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'POST',
                'url': 'http://localhost:3000/orders/' + result._id
            }
        });
    }).catch(err => {
        res.status(500).json({
            message: "Product Not Found",
            error: err
        })
    })


})
router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    order: docs,
                    request: {
                        type: 'GET',
                        desc: 'GET_ALL_PRODUCT',
                        url: 'http://localhost:3000/orders/'
                    }
                })
            } else {
                res.status(404).json({
                    message: "no records found for this id"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })

})
router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;

    Order.remove({ _id: id }).exec().then(result => {
        res.status(200).json({
            message: 'Order deleted successfully',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders/',
                body: { quantity: 'Number', productId: 'string' }
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
    })
})

module.exports = router