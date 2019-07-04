const express = require("express");
const router = express.Router();
const mongooes = require('mongoose');
const bcrypt = require('bcrypt')

const User = require('../models/user')

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length > 1) {
            return res.status(409).json({
                message: "user alerady exists"
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User({
                        _id: new mongooes.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save().then(
                        result => {
                            console.log(result)
                            res.status(200).json({
                                message: 'User created succefully'
                            })
                        }
                    ).catch(err => {
                        return res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })



})

module.exports = router;    