const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    roll: { type: Number, require: true },
    fname: { type: String, require: true },
    lname: { type: String, require: true }
})

module.exports = mongoose.model('Student', studentSchema)