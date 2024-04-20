const express = require('express');
const router = express.Router();
const upload = require('../multerConfig');

const { registerVolunteer } = require('../controllers/volunteerController');
router.post('/registerVolunteer', upload, registerVolunteer);

module.exports = router;