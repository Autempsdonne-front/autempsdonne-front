const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

router.get('/', newsletterController.getAllNewsletters);

router.post('/add', newsletterController.createNewsletter);

module.exports = router;
