const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/sign-up', organizationController.signUp)
router.post('/upload-orders', authMiddleware(['organization']), organizationController.upload.single('ordersFile'), organizationController.uploadOrders)

module.exports = router