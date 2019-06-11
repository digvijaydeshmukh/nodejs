const express = require("express");
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'orders are fetched'
    })
})

router.post('/', (req, res, next) => {
    const order={
        productId:req.body.productId,
        orderId:req.body.orderId
    }
    res.status(200).json({
        message: 'order was created',
        order:order
    })

})
router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: "get order by Id",
        id: req.params.orderId
    })
})
router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: "order delete succefully",
        orderId: req.params.orderId
    })
})

module.exports = router