const mongoose = require('mongoose')

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        rquired: true
    }
}, { timestamps: true })

const organization = mongoose.model('Organization', organizationSchema)

module.exports = organization