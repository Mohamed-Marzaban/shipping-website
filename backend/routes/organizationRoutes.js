const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationCobtroller')


router.post('/sign-up', organizationController.signUp)


module.exports = router