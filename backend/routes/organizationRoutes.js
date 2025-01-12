const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationCobtroller')


router.post('/sign-up', organizationController.signUp)
router.post('/login', organizationController.login)
router.post('/logout', organizationController.logout)


module.exports = router