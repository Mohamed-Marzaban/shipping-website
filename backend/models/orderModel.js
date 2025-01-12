const mongoose = require('mongoose')
const shortid = require('shortid');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        default: () => `Order-${shortid.generate()}`,
        required: true,
        unique: true,
    },
    trackingNumber: {
        type: String,
        default: () => `TRK-${shortid.generate()}`,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['Delivered', 'Out for Delivery', 'Pending Pickup', 'Refunded'],
        default: 'Pending Pickup',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Card'],
        required: true
    },
    quantity: {
        type: Number
    },
    totalAmount: {
        type: Number
    },
    productDescription: {
        type: String,
        required: true
    },
    recipientName: {
        type: String,
        required: true
    },
    recipientEmail: {
        type: String,
    },
    recipientPhone: {
        type: String,
        required: true
    },
    recipientAddress: {
        type: String,
        required: true
    },
    organizationName: {
        type: String,
        required: true
    },
    organizationId: {
        type: mongoose.Types.ObjectId,
        ref: 'Organization'
    }

}, { timestamps: true })

const order = mongoose.model('Order', orderSchema)

module.exports = order 
