const express = require("express");
const router = express.Router();
const mongooes = require('mongoose');

const Student = require('../models/student')
router.get('/', (req, res, next) => {
    Student.find().select("_id roll fname lname").exec().then(doc => {
        res.status(200).json({
            count: doc.length,
            students: doc.map(docs => {
                return {
                    id: docs._id,
                    roll: docs.roll,
                    fname: docs.fname,
                    lname: docs.lname
                }
            })
        })
    }).catch(err => {
        res.status(500).json({
            message: err
        })
    })

})

router.post('/', (req, res, next) => {
    const student = new Student({
        _id: new mongooes.Types.ObjectId(),
        roll: req.body.roll,
        fname: req.body.fname,
        lname: req.body.lname

    })
    console.log(student)
    student.save().then(result => {
        console.log(result)
        res.status(201).json({

            message: "studnet created succefully",
            studentInfo: {
                id: result._id,
                roll: result.roll,
                fname: result.fname,
                lname: result.lname
            }

        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

router.delete('/:studnetId', (req, res, next) => {
    const id = req.params.studnetId;
    Student.deleteOne({_id:id}).then(data => {
        res.status(200).json({
            message: "student successfully deleted"
        })
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })

})

module.exports = router;   