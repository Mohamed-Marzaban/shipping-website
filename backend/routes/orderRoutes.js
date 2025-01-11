const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController')




router.post('/upload-orders', orderController.upload.single('ordersFile'), orderController.uploadOrders)
router.post('/create-order', orderController.createOrder)
router.get('/orders', orderController.viewAllOrders)
router.get('/pending-orders', orderController.viewPendingPickUpOrders)
router.get('/delivered-orders', orderController.viewDeliveredOrders)
router.get('/OFD-orders', orderController.viewOutForDeliveryOrders)
router.delete('/order/:orderId', orderController.deleteOrder)
router.patch('/order/:orderId', orderController.updateOrder)

module.exports = router