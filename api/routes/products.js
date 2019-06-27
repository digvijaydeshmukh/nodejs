const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../models/product')
const multer=require('multer')



const storage=multer.diskStorage({
    destination:function(req,file,cb){
        console.log(file)
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}
const upload=multer({
    storage:storage,
    limits:{
    fileSize:1024*1024*5
    },
    fileFilter:fileFilter
})



router.get('/', (req, res, next) => {
    Product.find().select("name price _id productImage").exec().then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    id: doc._id,
                    productImage:doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }

            })
        }
        res.status(200).json(response)
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
    // res.status(200).json({
    //     message: 'hi from product'
    // });
})

router.post('/',upload.single('productImage'), (req, res, next) => {
    // console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage:req.file.path
    })

    product.save().then(result => {
        res.status(201).json({
            message: "Product created successfully",
            createProduct: {
                name: result.name,
                price: result.price,
                id: result._id,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });

    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select("name price _id productImage")
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    product: docs,
                    request: {
                        type: 'GET',
                        desc: 'GET_ALL_PRODUCT',
                        url: 'http://localhost:3000/products/'
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
    const id = req.body.productId;

    const updateName = {}
    for (const item of req.body) {
        updateName[item.propName] = item.value;
    }
    console.log("tt", updateName)
    Product.updateOne({ _id: id }, { $set: updateName }).exec().then(result => {
        console.log(result)
        res.status(200).json(result)
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })

})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.deleteOne({ _id: id }).exec().then(result => {
        res.status(200).json({
            message: 'Product deleted successfully',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/',
                body: { name: 'String', price: 'Number' }
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
    })
})

module.exports = router;